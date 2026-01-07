import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function normalizeEmail(input) {
  if (typeof input !== "string") return "";
  return input.trim().toLowerCase();
}

function isValidEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePin(input) {
  if (typeof input !== "string") return "";
  return input.trim();
}

function isValidPin(pin) {
  if (!pin) return false;
  if (!/^\d{4,12}$/.test(pin)) return false;
  return true;
}

function hashPin(pin, saltBase64) {
  const salt = Buffer.from(saltBase64, "base64");
  const derived = scryptSync(pin, salt, 64);
  return derived.toString("base64");
}

function generateUserId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (typeof uuid === "string" && uuid) return uuid;
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 33) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  return { name, about, phone: "", picture };
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const email = normalizeEmail(body?.email);
  const pin = normalizePin(body?.pin);
  const profile = sanitizeProfile(body?.profile ?? body);

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }
  if (!isValidPin(pin)) {
    return NextResponse.json({ error: "PIN must be 4-12 digits" }, { status: 400 });
  }

  let userId = "";

  try {
    const db = await getDb();
    const users = db.collection("users");
    const existing = await users.findOne({ _id: email });

    if (existing) {
      const salt = typeof existing?.pinSalt === "string" ? existing.pinSalt : "";
      const stored = typeof existing?.pinHash === "string" ? existing.pinHash : "";
      const existingUserId = typeof existing?.userId === "string" ? existing.userId : "";

      if (!salt || !stored || !existingUserId) {
        return NextResponse.json({ error: "Invalid account state" }, { status: 500 });
      }

      const next = hashPin(pin, salt);
      const ok = timingSafeEqual(Buffer.from(stored, "base64"), Buffer.from(next, "base64"));
      if (!ok) {
        return NextResponse.json({ error: "Invalid email or PIN" }, { status: 401 });
      }

      userId = existingUserId;
    } else {
      userId = generateUserId();
      const salt = randomBytes(16).toString("base64");
      const pinHash = hashPin(pin, salt);
      await users.insertOne({
        _id: email,
        email,
        userId,
        pinSalt: salt,
        pinHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const safeProfile = {
        ...profile,
        name: profile.name || email.split("@")[0],
      };

      await db.collection("profiles").updateOne(
        { _id: userId },
        { $set: { ...safeProfile, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const res = NextResponse.json({ userId, profile });
  const secure = process.env.NODE_ENV === "production";

  res.cookies.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  res.cookies.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  return res;
}
