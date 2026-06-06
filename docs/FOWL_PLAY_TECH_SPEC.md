# FOWL PLAY — Technical Specification

Companion to the GDD. Written for handoff to a Claude Code build session.

---

## 1. Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js (App Router) + TypeScript | Your daily driver, deploys to Vercel cleanly. |
| Hosting | Vercel Hobby (free) | Serves the app, API routes, and static assets. Low traffic, well within limits. |
| Persistence + sync | **Supabase (free tier): Postgres + Realtime** (recommended) | Stack you already know from Bone Road. True push over websockets, real Postgres, a dashboard to watch state during the party. See section 2. Upstash Redis + polling kept as a lighter fallback. |
| UI library | **RetroUI (retroui.dev)** | Neo-brutalism component set built on shadcn/ui + Tailwind. Bold borders, flat shadows, pop-art energy. Mobile responsive. See section 11. |
| Styling | Tailwind CSS (comes with RetroUI) | Utility-first, mobile-first, readable on a TV. |
| QR | `qrcode.react` | Render the join QR on the host screen. |
| State (client) | React state + Supabase Realtime subscriptions | No heavy state lib needed. |

No auth provider needed. This is a throwaway party room. Players are identified by a client-generated UUID stored in `localStorage`.

## 2. Persistence and Realtime

**Decision: Supabase (Postgres + Realtime).** It is the stack you already operate fluently, it gives true server-push sync over websockets, a real Postgres, and a live dashboard you can watch during the party. The free tier covers everything here with room to spare.

The key thing it solves: Vercel serverless functions cannot hold a websocket open, which is the usual pain point for a Jackbox-style game. Supabase sidesteps it because the browser connects directly to Supabase's realtime servers, not through a Vercel function. Vercel just ships the app and static assets.

```
Phones  <--websocket-->  Supabase Realtime  <--websocket-->  Host TV
                                |
                            Postgres (source of truth)

Vercel only serves the Next.js app + static assets. Live sync never touches a Vercel function.
```

One clarification worth pinning down, since the two get conflated:
- **Supabase Realtime** is what you want. It pushes database changes (or broadcast messages) straight to subscribed browser clients over websockets. This is how the phones and TV stay in sync.
- **Database Webhooks** are a different feature: they fire an HTTP POST to a server endpoint when a row changes, for server-to-server reactions like calling an external API. They do not push to browsers, so you will not use them for this game.

Within Realtime you have three modes. Use **Postgres Changes** (subscribe to inserts/updates on your tables) as the backbone. Optionally use **Presence** for live "who's connected" dots. Broadcast is available if you ever want ephemeral low-latency messages, but Postgres Changes is enough here.

### Fallback: Upstash Redis + short polling

If you ever wanted to avoid Supabase entirely and stay inside Vercel, the lighter alternative is Upstash Redis (one-click from the Vercel Marketplace, env vars auto-injected) with the whole game stored as a single JSON blob keyed by room code, and phones polling a tiny API route about once a second. No schema, ~1s latency. It works fine for a party but gives up the push immediacy and the Postgres dashboard. Kept here as Option B in the sections below in case you want it, but the recommended path is Supabase.

## 3. Data Model

### Option A (recommended): Postgres tables with Realtime

```sql
-- games
id                  uuid primary key default gen_random_uuid()
room_code           text not null            -- 4 uppercase letters, e.g. "FOWL"
status              text not null default 'lobby'
                    -- lobby | question_intro | answering | reveal | scoreboard | finished
current_q_index     int  not null default 0
question_started_at timestamptz
created_at          timestamptz default now()

-- players
id            uuid primary key                -- client-generated, stored in localStorage
game_id       uuid references games(id) on delete cascade
name          text not null
avatar        text not null                   -- 'owl', 'pigeon', etc.
score         int  not null default 0
last_seen     timestamptz default now()
joined_at     timestamptz default now()

-- answers
id              uuid primary key default gen_random_uuid()
game_id         uuid references games(id) on delete cascade
player_id       uuid references players(id) on delete cascade
q_index         int  not null
choice          text not null                 -- stored choice index
is_correct      bool
points_awarded  int  default 0
answered_at     timestamptz default now()
unique (game_id, player_id, q_index)          -- one answer per player per question
```

Enable Realtime on `games`, `players`, and `answers`. Turn on Row Level Security with permissive policies for the room (party game, no sensitive data). Keep it simple: allow read/write to anyone holding the room context.

### Option B (lighter fallback): one Redis JSON blob per game

No schema, no migrations. The whole game lives under one key, `game:ABCD`. The host is the source of truth and writes the blob; everyone reads it.

```jsonc
// key: game:ABCD   (set a TTL of a few hours so old rooms self-clean)
{
  "roomCode": "ABCD",
  "status": "lobby", // lobby | question_intro | answering | reveal | scoreboard | finished
  "currentQIndex": 0,
  "questionStartedAt": null,        // epoch ms, set when ANSWERING begins
  "players": [
    { "id": "uuid", "name": "Sam", "avatar": "owl", "score": 0, "lastSeen": 0 }
  ],
  "answers": {                      // keyed by qIndex, then playerId
    "0": { "uuid": { "choice": 2, "answeredAt": 0, "correct": false, "points": 0 } }
  }
}
```

With this approach, reads and writes go through small Next.js API routes and clients poll (see section 4, Option B). For 16 players this is comfortably safe with last-write-wins.

## 4. Sync Mechanics

### Option A (recommended): Supabase Realtime subscriptions

Use Postgres Changes subscriptions, scoped per game. True push, sub-second.

- **Host TV** subscribes to:
  - `players` (game_id) -> lobby grid + leaderboard updates.
  - `answers` (game_id, current q) -> how many have answered, then tally on reveal.
- **Player phones** subscribe to:
  - `games` (id) -> `status` and `current_q_index` drive the whole phone UI (waiting / answering / locked / look at TV).

Write paths:
- Host writes `games.status`, `current_q_index`, `question_started_at` as it advances.
- Players insert into `answers`.
- Host computes scoring on reveal and updates `players.score`.

Timers run client-side off `question_started_at` so they stay smooth. Optionally use **Supabase Presence** for live "who's connected" dots, but `last_seen` is enough for v1. Remember to remove channel subscriptions on unmount so phones that lock or navigate away clean up.

### Option B (fallback): polling loop

If you went with the Upstash fallback, a single `usePollGame(roomCode)` hook on both screens does `GET /api/game/[code]` every 1 to 1.5 seconds and stores the blob in React state. The whole UI is a function of `status` and `currentQIndex`.

- **Host TV**: polls, renders from the blob, and POSTs transitions to `/api/game/[code]/advance` on Next or Skip.
- **Player phones**: poll for `status`, show answer buttons when answering, POST to `/api/game/[code]/answer` on tap, then show the locked state.
- Timers still run client-side from `questionStartedAt`. Stop polling at `finished`, slow it when the tab is hidden.

## 5. Room Code and QR

- On "Create Game," generate a 4-letter uppercase code (avoid ambiguous letters: no I, O, 1, 0). Check it is not already active.
- Join URL: `https://yourapp.vercel.app/play/ABCD`.
- Host renders the QR of that URL plus the code in big text. Phones scan or type.

## 6. Routes (Next.js App Router)

Pages:
```
/                      Landing: "Host a game" button.
/host                  Creates a game, shows lobby/QR, runs the host state machine on the TV.
/play                  Player landing: enter room code if not deep-linked.
/play/[code]           Player join (name + avatar) then the live answer UI.
```

With Supabase (Option A), most writes go straight from the client using the Supabase JS client and the anon key, guarded by RLS. You need very little server code:
```
Server action / route: createGame   Generates a unique room code, inserts the games row.
Client (Supabase):      joinGame      Insert into players.
Client (Supabase):      submitAnswer  Insert into answers.
Client (Supabase):      advance       Host updates games.status / current_q_index / question_started_at.
Scoring:                Host computes on reveal and updates players.score (a small RPC/function keeps the answer key off the client if you want).
```

If you took the Upstash fallback (Option B) instead, you would add these API routes, since the blob is written server-side:
```
POST /api/game                 Create a room. Generates code, writes the blob, returns code.
GET  /api/game/[code]          Read the current blob. Polled by both screens.
POST /api/game/[code]/join     Add a player to the blob.
POST /api/game/[code]/answer   Record { playerId, choice } into answers[qIndex].
POST /api/game/[code]/advance  Host-only state transition.
```
with a redis helper in `/lib/redis.ts`. For Supabase you keep a `/lib/supabase.ts` client instead.

## 7. Question Bank Format

Ship as `/public/questions.json` (or `/data/questions.ts` for type safety). Suggested schema:

```jsonc
{
  "id": "q001",
  "type": "multiple_choice",       // multiple_choice | name_that_bird | name_that_call | bluff
  "prompt": "Which bird can fly backwards?",
  "media": { "image": null, "audio": null },  // "/birds/hummingbird.jpg" etc.
  "choices": ["Hummingbird", "Bald Eagle", "Emperor Penguin", "Ostrich"],
  "answer_index": 0,
  "fun_fact": "Hummingbirds are the only birds that can fly fully backwards.",
  "difficulty": 1                  // 1 easy, 2 medium, 3 hard
}
```

Sample seed questions to start the bank:

```jsonc
[
  { "id":"q001","type":"multiple_choice","prompt":"Which bird can fly backwards?","choices":["Hummingbird","Bald Eagle","Emperor Penguin","Ostrich"],"answer_index":0,"fun_fact":"Hummingbirds can hover and fly backwards.","difficulty":1 },
  { "id":"q002","type":"multiple_choice","prompt":"What is a group of crows called?","choices":["A murder","A parade","A giggle","A bouquet"],"answer_index":0,"fun_fact":"A group of crows is a murder.","difficulty":1 },
  { "id":"q003","type":"multiple_choice","prompt":"Which bird is the fastest animal on Earth in a dive?","choices":["Peregrine Falcon","Ostrich","Albatross","Mallard"],"answer_index":0,"fun_fact":"Peregrine falcons dive over 200 mph.","difficulty":2 },
  { "id":"q004","type":"multiple_choice","prompt":"Penguins are found naturally in which place?","choices":["Southern Hemisphere","North Pole","Sahara Desert","Iceland only"],"answer_index":0,"fun_fact":"No wild penguins live at the North Pole.","difficulty":1 }
]
```

Aim for **10 to 12 questions** so a short ~10 minute game has a couple of spares to drop. Suggested mix: about 4 multiple choice, 3 to 4 name that bird (photo), 2 to 3 name that call (audio). Heavily weight difficulty 1 and 2 for a chill party.

## 8. Asset Handling

- **Avatars**: 8 AI images in `/public/avatars/{name}.png`. Square, ~512px, transparent or simple background.
- **Bird photos**: download from Wikimedia Commons / iNaturalist to `/public/birds/`. Do not hotlink. Keep `CREDITS.md`.
- **Bird calls** (if using audio round): download CC clips from xeno-canto to `/public/calls/`, trim to ~5s, keep attribution. Play on the host TV only.
- Optimize images so the static bundle stays light (Vercel free bandwidth is generous but no need to ship 5MB photos).

## 9. Environment Variables

Option A (Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
Both are safe to expose client-side with sensible RLS. Add a service-role key (server-only, never `NEXT_PUBLIC_`) if you use a server function for scoring.

Option B (Upstash fallback), auto-injected when you provision the Marketplace integration:
```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

That is it for v1.

## 10. Free Tier Fit

| Service | Free limit | Our usage |
|---------|-----------|-----------|
| Vercel Hobby | Generous bandwidth, serverless functions | Static app, a little server code, trivial traffic. Fine. |
| Supabase free | 500MB Postgres, Realtime with ample concurrent connections | One small game, ~16 players, tiny tables. Easily fine. |
| Upstash Redis (if Option B) | Large command count per day on free tier | A few thousand reads for a 10-minute game. Easily fine. |

A 16-person party is a rounding error on all of these. Verify current free limits before the party since they shift.

## 11. UI and Visual Style (RetroUI)

Use **RetroUI** (retroui.dev): a neo-brutalism component library built on shadcn/ui, React, Tailwind, and TypeScript, MIT licensed, with 100+ components. It is a great fit for a loud, fun, pop-art party game and it is mobile responsive out of the box.

Heads up on naming: the library you want is the one at **retroui.dev** (neo-brutalism, shadcn-based). There is a separate, unrelated project called "pixel-retroui" (retroui.io) that is pixel/Minecraft styled. Do not install that one by mistake.

### Install
RetroUI installs the shadcn way: components are added into your own project so you fully own and can tweak them.
1. Scaffold the app: `npx create-next-app@latest fowl-play --typescript --tailwind --app`.
2. Initialize shadcn in the project.
3. Add RetroUI components from the RetroUI registry per the official installation guide at `retroui.dev/docs`. Follow that guide for the exact add commands, since they own the current registry URLs.
4. Components are plain React + Tailwind, so customize freely with Tailwind classes and component props.

### Aesthetic (neo-brutalism, pop-art)
The look is defined by a few consistent tokens. Bake these into your Tailwind theme so every screen feels cohesive:
- **Thick black borders** (about 2 to 4px) on every card, button, and input.
- **Hard offset shadows** with no blur (for example a solid 4px x 4px black shadow). On press, the shadow collapses and the element nudges, which gives buttons a satisfying tactile click. Great for phones.
- **High-contrast pop-art palette.** Suggested party set: a warm cream background, black ink for borders and text, and bold accent pops for the four answer buttons and highlights. For example hot pink, electric blue, sunny yellow, and lime, rotated across the four multiple-choice options so each answer has its own loud color.
- **Big chunky display type** for headings (RetroUI ships bold display fonts; pair with a clean sans for body). Size headings up aggressively on the host screen so the TV reads from across the room.
- Mostly flat fills, minimal gradients, generous spacing.

### Component mapping
- **Landing /**: big Text title, one chunky Button ("Host a game").
- **Host lobby**: Card framing the QR (use `qrcode.react` inside it), a large Badge or pill showing the room code in huge type, and a responsive grid of Cards showing each joined player's avatar and name. Big "Start" Button.
- **Host question / reveal**: Card for the prompt, optional image, a Progress component (or a custom ring) for the countdown, a Badge for the round type ("Name That Call"). On reveal, color the correct answer and show the fun fact in a Card.
- **Host scoreboard / final**: a stack of Cards with Avatar plus name plus score, and a podium of three Cards for the finale, Badge components for the silly superlatives.
- **Player join /play/[code]**: an Input for the name, a grid of selectable avatar tiles (Cards or toggle Buttons with a selected state), and a Button to join.
- **Player answering**: four full-width Buttons, one per choice, each in a different accent color, large tap targets. After tap, swap to a locked state Card ("Locked in. Look at the TV.").

### Mobile responsiveness
Two different surfaces, two different scales:
- `/play` is phone-first: single column, full-width chunky buttons, large tap targets, minimal text. Design at ~380px width first.
- `/host` is TV-first: scale type and spacing way up (use large Tailwind text sizes and a max-width container), since it is viewed from the couch. You can branch layout by route rather than by media query.
- RetroUI components are responsive, but the borders and shadows should scale a touch on the TV so they still read as bold at distance.

Keep animation light. Neo-brutalism lives in the static boldness plus the press interaction, not motion. A little confetti on a correct answer is a fun exception.

## 12. Build Plan (this week)

Assuming you start this weekend.

- **Day 1**: Scaffold Next.js + Tailwind, install RetroUI, create the Supabase project, add the three tables, and enable Realtime. Build the create-game and join flow and the lobby grid with live avatars via Realtime subscriptions. Get two phones joining a TV view.
- **Day 2**: Question state machine on the host (status transitions), answer inserts from phones, reveal, scoring, and scoreboard. One round type working end to end.
- **Day 3**: Drop in the question bank (you already have `questions.json`), generate and wire up the 8 avatars, add the Name That Bird photos and the three bird calls, QR rendering, and the RetroUI styling pass for TV readability.
- **Day 4**: Leaderboard polish, final results podium and superlatives, host Next/Skip controls, reconnect handling, and the audio round playing on the host only.
- **Day 5**: Deploy to Vercel, full rehearsal with 2 to 3 phones on your actual TV and wifi, fix whatever breaks.
- **Buffer**: leave a day. Something always breaks on the real TV.

## 13. Deployment Steps

1. Push repo to GitHub.
2. Import into Vercel. Create the Supabase project, run the schema, enable Realtime, and add the Supabase URL and anon key to Vercel env vars (Option B: provision Upstash from the Storage tab instead).
3. Deploy. Note the production URL.
4. Set the production URL for the QR join link (env or constant).
5. Test the QR from a phone on the same wifi you will use at the party.

## 14. Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Wifi flakiness at party | Phones connect directly to Supabase, not through your laptop, so the laptop hiccuping does not kick players. Reconnect by stored player id, and re-subscribe on reconnect. Keep questions text-light. |
| Live API fails mid-party | No live APIs. Everything is baked into the static bank and local assets. |
| Phone audio autoplay blocked | Play all audio on the host TV only. |
| Realtime channel cleanup | Unsubscribe channels on unmount so locked or backgrounded phones do not leak connections. Re-subscribe on focus. |
| A question flops | Host Skip button. |
| Duplicate or troll names | Host kick control, optional light name filter. |
| Free tier limit surprise | Check current Vercel and Supabase limits before the party. Realtime connection counts are far above what 16 players need. |
