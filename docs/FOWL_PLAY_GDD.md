# FOWL PLAY
### A Bird Brain Party Quiz (Game Design Document)

> Working title. Alternatives: BEAK FREAKS, FLOCK PARTY, BIRD BRAINS, FEATHER FRENZY. Rename freely.

---

## 1. Pitch

A Jackbox-style local party trivia game about birds. The host runs the game on a laptop plugged into the living room TV. Guests scan a QR code, join from their phones in seconds, pick a silly bird avatar, type their name, and start answering. Light, chaotic, casual, bird-themed. Built for one party, one evening, your wife as the guest of honor.

## 2. Design Goals

- **Zero friction onboarding.** Scan QR, type name, pick bird, done. No app install, no account, no login.
- **Party-proof.** Late joiners welcome. Phones that lock or drop wifi can rejoin without losing their score.
- **Chill over cutthroat** (tunable). Everyone should feel like they can play even if they know nothing about birds.
- **Shippable this week.** Minimal moving parts, reuse a stack you already know, no live dependencies during the party.
- **Big readable TV screen.** The host display is the centerpiece. Phones are just buzzers.

## 3. Players and Devices

| Role | Device | Purpose |
|------|--------|---------|
| Host | Laptop on TV | Source of truth, shows QR, questions, timer, leaderboard. Host clicks to advance. |
| Players | Phones | Join, pick avatar, submit answers. Mobile-first vertical layout. |

Recommended player count: 3 to 16. Works fine for a living room party.

## 4. Core Game Loop (State Machine)

```
LOBBY  ->  QUESTION_INTRO  ->  ANSWERING  ->  REVEAL  ->  SCOREBOARD  -> (loop)  ->  FINAL_RESULTS
```

1. **LOBBY**: Host screen shows the QR code and room code. Players join and appear as bird avatars in a grid. Host clicks Start when ready.
2. **QUESTION_INTRO**: Question and any media (photo) appear on the TV. Short beat so people can read.
3. **ANSWERING**: Answer options appear on phones. Countdown timer runs (default 15s). Players tap an answer. Phones lock once submitted.
4. **REVEAL**: TV shows the correct answer, a fun fact, and who got it right. Points awarded.
5. **SCOREBOARD**: Running leaderboard with avatars. Host clicks Next.
6. **FINAL_RESULTS**: Podium for top 3, a fun superlative for everyone (see 7.4).

Host always controls advancement with a Next button, so nobody gets rushed. Timer auto-advances ANSWERING to REVEAL when it hits zero.

## 5. Round Types

**v1 (locked): Multiple Choice Trivia, Name That Bird (photo), Name That Call (sound). Bluff round is cut from v1 to save build time.**

All share the same answer-on-phone mechanic.

Suggested mix for a short ~8-10 question game: 4 multiple choice, 3 name that bird, 2 to 3 name that call. Open and close on easy crowd-pleasers.

### 5.1 Multiple Choice Trivia (core)
A question with 4 options. Tap one. Classic.
> "Which of these birds can fly backwards?" -> Hummingbird

### 5.2 Name That Bird (photo)
A bird photo on the TV, 4 name options on phones.
> Photo of a puffin -> Puffin / Penguin / Toucan / Macaw

### 5.3 Name That Call (audio, optional)
A bird call plays on the TV speakers only (audio autoplay is reliable on the host, flaky on phones, so keep sound on the host). 4 options on phones.
> Loon call -> Common Loon

### 5.4 Bluff Round (Fibbage-style, optional, the chaos engine)
A bird fact with a blank. Players type a fake answer on their phones. The game mixes everyone's lies with the real answer and shows them all. Everyone picks what they think is true.
- Points for picking the truth.
- Bonus points each time someone picks YOUR lie.
> "The ___ can sleep while flying." (truth: Frigatebird) Players invent fakes like "Disco Pigeon," then everyone votes.

This round is the biggest laugh generator and the most Jackbox-y. It adds build complexity (text input, submission collection, dedupe vs the real answer). **Cut from v1.** Keep as the top post-party stretch goal if you ever revive this.

## 6. Scoring

**Tuned for casual-but-leaderboard: scores are always visible, but wrong answers never punish and the speed bonus is gentle so birders and bird-clueless guests stay close.**

- Correct answer: **1000 base points**.
- Speed bonus: scaled by time remaining, up to **+300** (faster = more). Kept modest so reading speed does not decide the game.
- Wrong answer: 0 points, no penalty.
- Leaderboard stays on screen at every scoreboard beat so there is a real race, but nobody gets buried.

## 7. Player Experience

### 7.1 Join Flow (phone)
1. Scan QR (or type the 4-letter room code at the join URL).
2. Enter name (max ~12 chars, profanity-lite filter optional).
3. Pick a bird avatar from a grid of silly birds.
4. Land in a waiting screen ("You're in. Watch the TV.").

### 7.2 Answering (phone)
- Big tappable answer buttons, color coded.
- Haptic or visual confirm on submit.
- Locked state after submit ("Locked in. Look at the TV.").
- Reconnect: phone stores a player id in localStorage so a refresh or lock/unlock rejoins the same player with the same score.

### 7.3 Host Screen (TV)
- Lobby: huge QR, room code, live grid of joined birds.
- Question: large prompt, optional photo, countdown ring, count of how many have answered (not who).
- Reveal: correct answer highlighted, fun fact, list of who nailed it.
- Scoreboard: top players with avatars, animated rank changes if time allows.

### 7.4 Final Results
- Podium top 3.
- Silly superlatives so everyone gets something: "Early Bird" (fastest avg), "Wise Owl" (most correct), "Best Liar" (most fooled, bluff round), "Free Bird" (most adventurous wrong guesses).

## 8. Content and Question Bank

**Key reliability decision: bake a static question bank into the app. Do not call any live API during the party.** Use open data ahead of time to build the bank, then ship it as JSON plus local assets. Zero runtime dependency means nothing can fail mid-party.

Current implementation: 24 questions, mixed difficulty, mostly approachable. Mix is 10 multiple choice, 8 Name That Bird photo rounds, and 6 Name That Call audio rounds. Aim for delight and "huh, neat" facts over obscurity.

Future target if this becomes more than a party build: 30 to 50 questions plus runtime shuffling/subset selection, so each game can stay short without always playing the same order.

### Open data sources (used at build time, not runtime)
- **Wikipedia / Wikimedia Commons**: bird facts and freely licensed photos. Download images locally and keep an attributions file (most are CC-BY or public domain).
- **Cornell Lab All About Birds**: great for fun facts and accurate trivia (reference for writing questions).
- **iNaturalist**: open observations and many CC-licensed photos for the Name That Bird round.
- **xeno-canto**: Creative Commons bird call recordings for the Name That Call round. Download locally, keep attribution.
- **eBird / GBIF**: taxonomy and range facts if you want question variety.

Respect CC attribution: ship a short `CREDITS.md` or an in-game credits screen listing photo and audio sources.

## 9. Party-Proofing Checklist

- Late joiners can enter during LOBBY and between questions.
- Reconnect by player id (localStorage) survives phone locks and refreshes.
- Host can kick a duplicate or troll name.
- Works on hotel-grade wifi: all heavy sync goes phone-to-realtime-service directly, not through your laptop.
- A "Skip question" host button in case a question flops.

## 10. Stretch Goals (only if time allows)

- Bluff round (5.4).
- Sound effects and a little synthwave-y lobby music on the TV (on brand for you).
- Animated avatars, confetti on correct, rank-change animations.
- Theme rounds (waterbirds, raptors, backyard birds).
- A "wife's favorites" custom round with inside-joke questions.

## 11. Tuning Decisions (locked)

- Round types: Multiple Choice, Name That Bird, Name That Call. No bluff round in v1.
- Length: expanded bank of 24 questions, roughly 20 minutes if played straight through. Host Skip keeps the pace flexible; a future shuffle/subset pass can restore a shorter 8-12 question game length.
- Vibe: casual but with a visible leaderboard. Gentle speed bonus, no penalties.

Still open: whether to add a small custom round of inside-joke questions for your wife.

## Appendix A: Silly Bird Avatar Prompts (txt2img)

Generate these as square sticker-style icons. Suggested set of 8. Full prompts delivered separately in chat. Save outputs to `/public/avatars/` as `owl.png`, `pigeon.png`, etc.

1. Grumpy Owl
2. Party Pigeon
3. Cool Flamingo
4. Derpy Duck
5. Wizard Raven
6. Disco Chicken
7. Buff Penguin
8. Detective Seagull
