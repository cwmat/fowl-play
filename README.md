# FOWL PLAY

A Jackbox-style local party quiz about birds. The host runs the TV view from a laptop, guests join from phones with a QR code, pick silly bird avatars, and answer short trivia rounds.

## Current Scaffold

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4 with a neo-brutalist visual base
- Static 24-question bank at `public/questions.json`
- Live host and phone routes:
  - `/` launch console
  - `/host` TV host view with QR, lobby, questions, scoring, and final results
  - `/play` room-code entry
  - `/play/[code]` phone/player join and answer flow
- Supabase Realtime client wiring for shared game state
- Supabase schema at `supabase/schema.sql`
- Local avatars, bird photos, calls, music, and SFX in `public/`

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
- `public/reader/` - generated host-only question reader clips and manifest
- `public/music/` - host/home background loops
- `public/sfx/` - randomized button click sounds

Keep photo and audio credits in `CREDITS.md`; see `docs/ASSET_MAP.md` for the runtime asset map.

## Local Question Reader Utility

The host can optionally play pre-generated reader audio during `question_intro` and `reveal`. The toggle is on by default in the host rail, but playback only happens for clips listed in `public/reader/manifest.json`.

Add `ELEVENLABS_API_KEY` to `.env.local` or pass it inline, then generate clips locally with ElevenLabs:

```bash
ELEVENLABS_API_KEY=... npm run audio:reader -- --dry-run --indexes 14 --phase all
ELEVENLABS_API_KEY=... npm run audio:reader -- --indexes 14 --phase intro --force
ELEVENLABS_API_KEY=... npm run audio:reader -- --ids q014,q017 --phase reveal
ELEVENLABS_API_KEY=... npm run audio:reader -- --force
```

Defaults:

- Voice ID: `rHWSYoq8UlV0YIBKMryp`
- Model: `eleven_multilingual_v2`
- Output: `mp3_44100_128`

The utility text-concats short randomized starter phrases with the question manifest. It writes MP3s into `public/reader/` and updates `public/reader/manifest.json`. The generator itself lives in `scripts/` and is excluded from Vercel upload by `.vercelignore`; the generated clips are normal static assets and should be committed when you want them deployed.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run audio:reader
```
