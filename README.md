# DIKOR — dikor.in (Demo v1)

Premium demo website for DIKOR, a custom 3D-printing gifting studio (from Instagram @dikor_in).
Warm gifting-atelier aesthetic: cream, champagne, rose-gold, gold — **not** tech-dark.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass clean)
```

## Demo accounts

| Role     | Email             | Password |
|----------|-------------------|----------|
| Customer | customer@demo.in  | demo123  |
| Admin    | admin@demo.in     | admin123 |

One-tap fill buttons are on the `/auth` page.

## Demo walkthrough (full order pipeline)

1. Sign in as **customer@demo.in** → **+ New order** → upload photos, submit.
2. Sign in as **admin@demo.in** → open the order → **Send quote** (price + timeline).
3. As customer: open order → **Pay advance** (mock — no real charge).
4. As admin: upload a **demo video** file → shared with customer.
5. As customer: **Approve** (or *Request changes* — revisions included).
6. As admin: **Start production** → update stage → **Mark ready — request balance**.
7. As customer: **Pay balance** → order **completed**.

## Architecture

- Next.js 14 App Router + TypeScript + Tailwind
- three.js / react-three-fiber hero (abstract keepsake sculpture, warm studio light)
- Lenis smooth scroll + Framer Motion reveals
- Backend = Next.js Route Handlers only; in-memory demo store (`lib/store.ts`), seeded
- Auth = HMAC-signed cookie sessions (demo credentials, demo only)
- Uploads stored as base64 data URLs (demo); payments are mock UI
- PWA: `app/manifest.ts`, generated icons, `public/sw.js`

## Order pipeline

`submitted → quoted → advance_paid → demo_shared → approved → in_production → ready_for_balance → completed`
