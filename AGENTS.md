<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# FOWL PLAY Agent Notes

## Product Shape

FOWL PLAY is a short, living-room party quiz about birds. The TV host route is the source of truth and the player route is phone-first. Preserve the low-friction Jackbox feel: scan QR, type name, pick avatar, answer, look back at the TV.

## Important Docs

- `docs/FOWL_PLAY_GDD.md` - game design, loop, scoring, party-proofing
- `docs/FOWL_PLAY_TECH_SPEC.md` - stack, Supabase Realtime model, routes, build plan
- `docs/FOWL_PLAY_QUESTION_BANK.md` - human-readable bank and source notes
- `docs/avatars.txt` - image prompts for the 8 sticker avatars
- `public/questions.json` - machine-readable question bank used by the app

## Current Stack

- Next.js App Router, TypeScript, React 19
- Tailwind CSS 4 via `@tailwindcss/postcss`
- Supabase JS client for planned Postgres Changes subscriptions
- `qrcode.react` for the TV lobby QR
- `lucide-react` for UI icons
- `supabase/schema.sql` as the starter database schema

## Build Guardrails

- Keep `/play` phone-first and single-column.
- Keep `/host` TV-readable with oversized type, thick borders, and hard shadows.
- Avoid live trivia APIs during gameplay; use baked JSON and local assets.
- Store player identity in `localStorage` when join logic is implemented.
- Use Supabase Realtime Postgres Changes as the main sync path, not Vercel websockets.
- Keep answer scoring gentle: no wrong-answer penalty, small speed bonus only.
- Add or update credits whenever photos or audio are added.

## Before Editing Next Files

Read the local Next docs that match the area you are changing, especially:

- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
