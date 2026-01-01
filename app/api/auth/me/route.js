import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 240) : "";
  const phone = typeof input?.phone === "string" ? input.phone.trim().slice(0, 32) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  return { name, about, phone, picture };
}

export async function GET() {
  const cookieStore = cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;

  if (auth !== "1" || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const profile = await db.collection("profiles").findOne({ _id: userId });
    return NextResponse.json({ userId, profile: profile ? sanitizeProfile(profile) : null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
