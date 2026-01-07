import { getDb } from "../../../../lib/mongodb";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 33) : "";
  const phone = typeof input?.phone === "string" ? input.phone.trim().slice(0, 32) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  return { name, about, phone, picture };
}

export async function GET(_req, { params }) {
  const resolvedParams = await params;
  const userId = String(resolvedParams?.userId || "").trim();
  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const cookieUserId = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || cookieUserId !== userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const profile = await db.collection("profiles").findOne({ _id: userId });
    return Response.json({ profile: profile ? sanitizeProfile(profile) : null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const resolvedParams = await params;
  const userId = String(resolvedParams?.userId || "").trim();
  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const cookieUserId = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || cookieUserId !== userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const nextProfile = sanitizeProfile(body?.profile ?? body);

  try {
    const db = await getDb();
    await db.collection("profiles").updateOne(
      { _id: userId },
      { $set: { ...nextProfile, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    return Response.json({ profile: nextProfile });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return Response.json({ error: message }, { status: 500 });
  }
}
