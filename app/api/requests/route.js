import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 240) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  const lastSeen =
    input?.lastSeen instanceof Date
      ? input.lastSeen.toISOString()
      : typeof input?.lastSeen === "string"
        ? input.lastSeen
        : "";
  return { name, about, picture, lastSeen };
}

function contactDocId(userId, contactUserId) {
  return `${userId}:${contactUserId}`;
}

export async function GET(req) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const me = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || !me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const kind = (url.searchParams.get("kind") || "all").trim();

  const db = await getDb();
  const requestsCol = db.collection("requests");
  const profilesCol = db.collection("profiles");
  const usersCol = db.collection("users");

  const filter =
    kind === "incoming"
      ? { toUserId: me, status: "pending" }
      : kind === "outgoing"
        ? { fromUserId: me, status: "pending" }
        : { status: "pending", $or: [{ toUserId: me }, { fromUserId: me }] };

  const reqDocs = await requestsCol
    .find(filter, { projection: { fromUserId: 1, toUserId: 1, status: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  const otherIds = Array.from(
    new Set(
      reqDocs
        .map((r) => (r.fromUserId === me ? r.toUserId : r.fromUserId))
        .filter((x) => typeof x === "string" && x)
    )
  );

  const [profiles, users] = await Promise.all([
    profilesCol
      .find({ _id: { $in: otherIds } }, { projection: { _id: 1, name: 1, about: 1, picture: 1, lastSeen: 1 } })
      .toArray(),
    usersCol.find({ userId: { $in: otherIds } }, { projection: { _id: 1, userId: 1 } }).toArray(),
  ]);

  const profileById = new Map(profiles.map((p) => [p._id, sanitizeProfile(p)]));
  const emailById = new Map(users.map((u) => [u.userId, u._id]));

  const items = reqDocs.map((r) => {
    const otherId = r.fromUserId === me ? r.toUserId : r.fromUserId;
    const otherProfile = profileById.get(otherId) || { name: "", about: "", picture: "" };
    const email = emailById.get(otherId) || "";
    return {
      id: String(r._id),
      fromUserId: r.fromUserId,
      toUserId: r.toUserId,
      status: r.status,
      createdAt: r.createdAt || null,
      other: { userId: otherId, email, ...otherProfile },
    };
  });

  return Response.json({ requests: items });
}

export async function POST(req) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const me = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || !me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const toUserId = typeof body?.toUserId === "string" ? body.toUserId.trim() : "";
  if (!toUserId) return Response.json({ error: "Missing toUserId" }, { status: 400 });
  if (toUserId === me) return Response.json({ error: "Cannot request yourself" }, { status: 400 });

  const db = await getDb();
  const requestsCol = db.collection("requests");
  const contactsCol = db.collection("contacts");

  const alreadyContact = await contactsCol.findOne({ _id: contactDocId(me, toUserId) }, { projection: { _id: 1 } });
  if (alreadyContact) return Response.json({ ok: true, status: "friends" });

  const existing = await requestsCol.findOne(
    {
      status: "pending",
      $or: [
        { fromUserId: me, toUserId },
        { fromUserId: toUserId, toUserId: me },
      ],
    },
    { projection: { _id: 1, fromUserId: 1, toUserId: 1, status: 1 } }
  );

  if (existing) {
    return Response.json({
      ok: true,
      requestId: String(existing._id),
      status: existing.fromUserId === me ? "outgoing" : "incoming",
    });
  }

  const insert = await requestsCol.insertOne({
    fromUserId: me,
    toUserId,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return Response.json({ ok: true, requestId: String(insert.insertedId), status: "outgoing" });
}

export async function PATCH(req) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const me = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || !me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const requestId = typeof body?.requestId === "string" ? body.requestId.trim() : "";
  const action = typeof body?.action === "string" ? body.action.trim() : "";
  if (!requestId) return Response.json({ error: "Missing requestId" }, { status: 400 });
  if (!["accept", "decline", "cancel"].includes(action)) {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  let _id;
  try {
    _id = new ObjectId(requestId);
  } catch {
    return Response.json({ error: "Invalid requestId" }, { status: 400 });
  }

  const db = await getDb();
  const requestsCol = db.collection("requests");
  const contactsCol = db.collection("contacts");

  const reqDoc = await requestsCol.findOne({ _id }, { projection: { fromUserId: 1, toUserId: 1, status: 1 } });
  if (!reqDoc) return Response.json({ error: "Not found" }, { status: 404 });
  if (reqDoc.status !== "pending") return Response.json({ ok: true, status: reqDoc.status });

  if (action === "cancel") {
    if (reqDoc.fromUserId !== me) return Response.json({ error: "Unauthorized" }, { status: 401 });
    await requestsCol.updateOne({ _id }, { $set: { status: "cancelled", updatedAt: new Date() } });
    return Response.json({ ok: true, status: "cancelled" });
  }

  if (reqDoc.toUserId !== me) return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (action === "decline") {
    await requestsCol.updateOne({ _id }, { $set: { status: "declined", updatedAt: new Date() } });
    return Response.json({ ok: true, status: "declined" });
  }

  const otherId = reqDoc.fromUserId;

  await Promise.all([
    requestsCol.updateOne({ _id }, { $set: { status: "accepted", updatedAt: new Date() } }),
    contactsCol.updateOne(
      { _id: contactDocId(me, otherId) },
      { $setOnInsert: { userId: me, contactUserId: otherId, createdAt: new Date() } },
      { upsert: true }
    ),
    contactsCol.updateOne(
      { _id: contactDocId(otherId, me) },
      { $setOnInsert: { userId: otherId, contactUserId: me, createdAt: new Date() } },
      { upsert: true }
    ),
  ]);

  return Response.json({ ok: true, status: "accepted" });
}
