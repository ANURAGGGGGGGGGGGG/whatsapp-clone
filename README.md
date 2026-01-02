## WhatsApp Clone (Next.js)

## Getting Started

### 1) Install

```bash
npm install
```

### 2) Environment variables

Create `.env.local` in the project root (it is gitignored) and set:

```bash
MONGODB_URI="your_mongodb_connection_string"
MONGODB_DB="whatsapp_clone"
```

### 3) Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Login (Email + PIN)

- If you are not logged in, visiting `/` redirects to `/login`.
- Login uses an email + numeric PIN (4–12 digits).
- On first login with a new email, an account is created and the PIN is stored hashed in MongoDB.
- Auth is cookie-based (demo auth, no email verification).

Files:
- Login page: [login/page.js](file:///c:/Users/acer/Coding%20stuff/New%20folder%20(3)/whatsapp_clone/app/login/page.js)
- Middleware redirect: [middleware.js](file:///c:/Users/acer/Coding%20stuff/New%20folder%20(3)/whatsapp_clone/middleware.js)

## Profile storage (MongoDB)

User profile fields (`name`, `about`, `picture`) are stored in MongoDB.

MongoDB collections:
- `users`: one document per email (stores `userId`, `pinSalt`, `pinHash`)
- `profiles`: one document per userId (`_id` is the `userId`)

API routes:
- `POST /api/auth/login` (creates/validates account, sets cookies)
- `GET /api/auth/me` (returns current userId + profile)
- `POST /api/auth/logout` (clears cookies)
- `GET /api/profile/:userId` (returns profile, requires auth cookies)
- `PUT /api/profile/:userId` (updates profile, requires auth cookies)

MongoDB connector:
- [mongodb.js](file:///c:/Users/acer/Coding%20stuff/New%20folder%20(3)/whatsapp_clone/lib/mongodb.js)

## WebRTC calling (PeerJS)

There is a simple 1:1 audio/video calling panel using PeerJS (public PeerJS server).
- Each user gets a Peer ID.
- You can call another user by entering their Peer ID.
- Supports answering and ending calls, plus mute/video toggles.

Main UI entry:
- The “AI” section shows the call panel: [page.js](file:///c:/Users/acer/Coding%20stuff/New%20folder%20(3)/whatsapp_clone/app/page.js)

Limitations:
- Peer-to-peer calls can fail behind strict NAT/firewalls without TURN.
- The public PeerJS server is for demos and may be unreliable for production.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
