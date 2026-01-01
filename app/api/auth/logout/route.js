import { NextResponse } from "next/server";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set(AUTH_COOKIE, "", { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0 });
  res.cookies.set(USER_ID_COOKIE, "", { httpOnly: true, sameSite: "lax", secure, path: "/", maxAge: 0 });

  return res;
}
