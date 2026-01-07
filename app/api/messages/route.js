import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function conversationId(a, b) {
  const x = typeof a === "string" ? a : "";
  const y = typeof b === "string" ? b : "";
  return [x, y].sort().join(":");
}

function contactDocId(userId, contactUserId) {
  return `${userId}:${contactUserId}`;
}

function sanitizeText(input) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 4000);
}

export async function GET(req) {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const me = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || !me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const other = (url.searchParams.get("with") || "").trim();
  const afterRaw = (url.searchParams.get("after") || "").trim();
  if (!other) return Response.json({ error: "Missing with" }, { status: 400 });
  if (other === me) return Response.json({ error: "Invalid with" }, { status: 400 });

  const convId = conversationId(me, other);

  let after = null;
  if (afterRaw) {
    const ms = Date.parse(afterRaw);
    if (Number.isFinite(ms)) after = new Date(ms);
  }

  try {
    const db = await getDb();
    const messagesCol = db.collection("messages");

    const filter = { conversationId: convId };
    if (after) filter.createdAt = { $gt: after };

    const docs = await messagesCol
      .find(filter, { projection: { fromUserId: 1, toUserId: 1, text: 1, createdAt: 1 } })
      .sort({ createdAt: 1 })
      .limit(300)
      .toArray();

    const messages = docs.map((d) => ({
      id: String(d._id),
      fromUserId: d.fromUserId,
      toUserId: d.toUserId,
      text: typeof d.text === "string" ? d.text : "",
      createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : "",
    }));

    return Response.json({ conversationId: convId, messages });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return Response.json({ error: message }, { status: 500 });
  }
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
  const text = sanitizeText(body?.text);
  if (!toUserId) return Response.json({ error: "Missing toUserId" }, { status: 400 });
  if (!text) return Response.json({ error: "Message is empty" }, { status: 400 });
  if (toUserId === me) return Response.json({ error: "Invalid toUserId" }, { status: 400 });

  const convId = conversationId(me, toUserId);

  try {
    const db = await getDb();
    const contactsCol = db.collection("contacts");
    const messagesCol = db.collection("messages");
    const conversationsCol = db.collection("conversations");

    const isContact = await contactsCol.findOne(
      { _id: contactDocId(me, toUserId) },
      { projection: { _id: 1 } }
    );
    if (!isContact) {
      return Response.json({ error: "You can only message contacts" }, { status: 403 });
    }

    const createdAt = new Date();
    const insert = await messagesCol.insertOne({
      conversationId: convId,
      fromUserId: me,
      toUserId,
      text,
      createdAt,
    });

    await conversationsCol.updateOne(
      { _id: convId },
      {
        $set: {
          participants: [me, toUserId],
          lastMessage: text,
          lastMessageAt: createdAt,
          updatedAt: createdAt,
        },
        $setOnInsert: { createdAt },
      },
      { upsert: true }
    );

    return Response.json({
      ok: true,
      message: {
        id: String(insert.insertedId),
        fromUserId: me,
        toUserId,
        text,
        createdAt: createdAt.toISOString(),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return Response.json({ error: message }, { status: 500 });
  }
}
