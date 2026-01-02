import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 240) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  return { name, about, picture };
}

export async function GET(req) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const me = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || !me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const qRaw = url.searchParams.get("q") || "";
  const q = qRaw.trim();
  if (q.length < 2) {
    return Response.json({ results: [] });
  }

  const db = await getDb();
  const usersCol = db.collection("users");
  const profilesCol = db.collection("profiles");
  const requestsCol = db.collection("requests");
  const contactsCol = db.collection("contacts");

  const rx = new RegExp(escapeRegex(q), "i");

  const [usersByEmail, profilesByName] = await Promise.all([
    usersCol
      .find({ _id: rx }, { projection: { _id: 1, email: 1, userId: 1 } })
      .limit(10)
      .toArray(),
    profilesCol.find({ name: rx }, { projection: { _id: 1, name: 1, about: 1, picture: 1 } }).limit(10).toArray(),
  ]);

  const candidateUserIds = new Set();
  const emailByUserId = new Map();

  for (const u of usersByEmail) {
    if (typeof u?.userId === "string" && u.userId) {
      candidateUserIds.add(u.userId);
      if (typeof u?._id === "string" && u._id) {
        emailByUserId.set(u.userId, u._id);
      }
    }
  }

  for (const p of profilesByName) {
    if (typeof p?._id === "string" && p._id) candidateUserIds.add(p._id);
  }

  candidateUserIds.delete(me);
  const userIds = Array.from(candidateUserIds).slice(0, 10);
  if (userIds.length === 0) {
    return Response.json({ results: [] });
  }

  const [profiles, usersForIds, requests, contacts] = await Promise.all([
    profilesCol.find({ _id: { $in: userIds } }, { projection: { _id: 1, name: 1, about: 1, picture: 1 } }).toArray(),
    usersCol.find({ userId: { $in: userIds } }, { projection: { _id: 1, userId: 1 } }).toArray(),
    requestsCol
      .find(
        {
          status: "pending",
          $or: [
            { fromUserId: me, toUserId: { $in: userIds } },
            { toUserId: me, fromUserId: { $in: userIds } },
          ],
        },
        { projection: { _id: 1, fromUserId: 1, toUserId: 1, status: 1 } }
      )
      .toArray(),
    contactsCol.find({ userId: me, contactUserId: { $in: userIds } }, { projection: { contactUserId: 1 } }).toArray(),
  ]);

  for (const u of usersForIds) {
    if (typeof u?.userId === "string" && u.userId && typeof u?._id === "string" && u._id) {
      emailByUserId.set(u.userId, u._id);
    }
  }

  const profileById = new Map(profiles.map((p) => [p._id, sanitizeProfile(p)]));

  const requestByOtherId = new Map();
  for (const r of requests) {
    const otherId = r.fromUserId === me ? r.toUserId : r.fromUserId;
    if (typeof otherId === "string" && otherId) requestByOtherId.set(otherId, r);
  }

  const contactIds = new Set(contacts.map((c) => c.contactUserId));

  const results = userIds.map((id) => {
    const profile = profileById.get(id) || { name: "", about: "", picture: "" };
    const email = emailByUserId.get(id) || "";
    const reqDoc = requestByOtherId.get(id);
    const requestStatus = contactIds.has(id)
      ? "friends"
      : reqDoc
        ? reqDoc.fromUserId === me
          ? "outgoing"
          : "incoming"
        : "none";
    const requestId = reqDoc?._id ? String(reqDoc._id) : "";
    return { userId: id, email, ...profile, requestStatus, requestId };
  });

  return Response.json({ results });
}

