# FOWL PLAY

A Jackbox-style local party quiz about birds. The host runs the TV view from a laptop, guests join from phones with a QR code, pick silly bird avatars, and answer short trivia rounds.

## Current Scaffold

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4 with a neo-brutalist visual base
- Static question bank at `public/questions.json`
- Placeholder host and phone routes:
  - `/` launch console
  - `/host` TV host shell with QR preview
  - `/play` room-code entry
  - `/play/[code]` phone/player shell
- Supabase client helper ready for Realtime work
- Supabase schema starter at `supabase/schema.sql`
- Asset folders ready for avatars, bird photos, and calls

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Copy `.env.example` to `.env.local` when the Supabase project exists:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Build Direction

The source artifacts live in `docs/`. The recommended v1 is:

1. Supabase tables for `games`, `players`, and `answers`.
2. Realtime subscriptions on host and player screens.
3. Host-controlled state machine: lobby, question intro, answering, reveal, scoreboard, finished.
4. Static question bank plus local media assets.
5. Gentle scoring: 1000 points for correct, up to 300 speed bonus, no penalty.

## Asset Slots

- `public/avatars/` - generated square sticker avatars from `docs/avatars.txt`
- `public/birds/` - cropped bird photos for Name That Bird
- `public/calls/` - short host-played audio clips for Name That Call

Keep photo and audio credits in a future `CREDITS.md`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
