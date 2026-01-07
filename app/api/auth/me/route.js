import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 33) : "";
  const phone = typeof input?.phone === "string" ? input.phone.trim().slice(0, 32) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  const lastSeen =
    input?.lastSeen instanceof Date
      ? input.lastSeen.toISOString()
      : typeof input?.lastSeen === "string"
        ? input.lastSeen
        : "";
  return { name, about, phone, picture, lastSeen };
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (auth !== "1" || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const profiles = db.collection("profiles");
    await profiles.updateOne(
      { _id: userId },
      { $set: { lastSeen: new Date(), updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    const profile = await profiles.findOne({ _id: userId });
    return NextResponse.json({ userId, profile: profile ? sanitizeProfile(profile) : null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (auth !== "1" || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    await db.collection("profiles").updateOne(
      { _id: userId },
      { $set: { lastSeen: new Date(), updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
