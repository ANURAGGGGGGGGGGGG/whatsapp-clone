import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const AUTH_COOKIE = "whatsapp_clone.auth";
const USER_ID_COOKIE = "whatsapp_clone.userId";

function sanitizeProfile(input) {
  const name = typeof input?.name === "string" ? input.name.trim().slice(0, 80) : "";
  const about = typeof input?.about === "string" ? input.about.trim().slice(0, 33) : "";
  const picture = typeof input?.picture === "string" ? input.picture.trim().slice(0, 500) : "";
  const lastSeen =
    input?.lastSeen instanceof Date
      ? input.lastSeen.toISOString()
      : typeof input?.lastSeen === "string"
        ? input.lastSeen
        : "";
  return { name, about, picture, lastSeen };
}

export async function GET() {
  const cookieStore = await cookies();
  const auth = cookieStore.get(AUTH_COOKIE)?.value;
  const me = cookieStore.get(USER_ID_COOKIE)?.value;
  if (auth !== "1" || !me) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const contactsCol = db.collection("contacts");
    const profilesCol = db.collection("profiles");
    const usersCol = db.collection("users");

    const contactDocs = await contactsCol
      .find({ userId: me }, { projection: { contactUserId: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    const ids = contactDocs
      .map((c) => (typeof c?.contactUserId === "string" ? c.contactUserId : ""))
      .filter(Boolean);

    if (!ids.length) return Response.json({ contacts: [] });

    const [profiles, users] = await Promise.all([
      profilesCol
        .find({ _id: { $in: ids } }, { projection: { _id: 1, name: 1, about: 1, picture: 1, lastSeen: 1 } })
        .toArray(),
      usersCol.find({ userId: { $in: ids } }, { projection: { _id: 1, userId: 1 } }).toArray(),
    ]);

    const profileById = new Map(profiles.map((p) => [p._id, sanitizeProfile(p)]));
    const emailById = new Map(users.map((u) => [u.userId, u._id]));

    const items = ids.map((id) => {
      const profile = profileById.get(id) || { name: "", about: "", picture: "" };
      const email = emailById.get(id) || "";
      return { userId: id, email, ...profile };
    });

    return Response.json({ contacts: items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return Response.json({ error: message }, { status: 500 });
  }
}
