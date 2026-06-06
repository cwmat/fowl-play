# FOWL PLAY — Starter Question Bank and Media Sources

12 questions (10 to 12 for a short game, 2 spares). Mix: 5 multiple choice, 4 name that bird, 3 name that call. The machine-readable version is `questions.json`. This file is the human-readable list plus where to get every photo and sound, with licenses.

Facts are written fresh, so you can copy them freely. Photos and audio have licenses, noted below. For a private one-time party, NonCommercial (NC) licenses are fine. Keep an in-game or printed credits list to respect attribution.

---

## Round 1: Multiple Choice (no media)

1. **Which of these birds can fly backwards?** -> Hummingbird
2. **What do you call a group of crows?** -> A murder
3. **Which bird is the fastest animal on Earth when diving?** -> Peregrine Falcon
4. **That fierce screech an eagle makes in the movies is usually dubbed from which bird?** -> Red-tailed Hawk
5. **About how far can an owl rotate its head?** -> 270 degrees

## Round 2: Name That Bird (photo)

6. Atlantic Puffin
7. Flamingo
8. Peacock
9. Toucan

## Round 3: Name That Call (audio, play on the TV only)

10. Common Loon
11. Barred Owl
12. Mourning Dove

---

## Photo Sources

Download to `/public/birds/`. Always open the file's page, confirm the current license, and note the author for credits. Crop to a clean square for the TV.

| Question | Bird | Verified source | License |
|----------|------|-----------------|---------|
| q006 | Atlantic Puffin | `commons.wikimedia.org/wiki/File:Atlantic_Puffin_in_flight.jpg` (by Thomas Gansow) | Public Domain (no attribution required, but credit is polite) |
| q007 | Flamingo | Wikimedia Commons category: `commons.wikimedia.org/wiki/Category:Phoenicopterus` | Pick a CC-BY or CC-BY-SA image, note author |
| q008 | Peacock | Wikimedia Commons category: `commons.wikimedia.org/wiki/Category:Pavo_cristatus` | Pick a CC-BY or CC-BY-SA image, note author |
| q009 | Toucan | Wikimedia Commons category: `commons.wikimedia.org/wiki/Category:Ramphastos` | Pick a CC-BY or CC-BY-SA image, note author |

Tip: photographer **Charles J. Sharp (Sharp Photography)** has clean, well-lit CC-BY-SA photos of almost every common bird on Wikimedia Commons. Great for crisp trivia images. Just attribute him.

## Audio Sources (xeno-canto)

Download to `/public/calls/`. Trim to about 5 seconds of the clearest call. Each recording's exact license is on its page, so confirm before use. Most are Creative Commons BY-NC-SA, which is fine for a private party. If you plan to trim, prefer a license without "NoDerivs" (ND).

| Question | Bird | Recording | Recordist | Notes |
|----------|------|-----------|-----------|-------|
| q010 | Common Loon | `xeno-canto.org/479757` | Sunny Tseng | Iconic wail, tremolo, and yodel. CC BY-NC-SA 4.0 (allows trimming). |
| q011 | Barred Owl | `xeno-canto.org/602835` | Steve Hampton | The classic "who cooks for you" call. Confirm license on page. |
| q012 | Mourning Dove | `xeno-canto.org/354052` | Lance A.M. Benner | The soft, sad coo. Confirm license on page. |

How to download from xeno-canto: open the page, use the "Download audio file" link. Convert to mp3 if needed and trim with any free editor (Audacity works).

## Attribution Snippet (drop into a credits screen or CREDITS.md)

```
Bird photos and sounds used under Creative Commons and public domain licenses.
Audio from xeno-canto.org: Common Loon (Sunny Tseng, XC479757),
Barred Owl (Steve Hampton, XC602835), Mourning Dove (Lance A.M. Benner, XC354052).
Puffin photo by Thomas Gansow (public domain, Wikimedia Commons).
Additional photos from Wikimedia Commons, see individual files for authors and licenses.
```

## Notes for the Build

- The audio round plays through the laptop and TV speakers only. Do not try to autoplay sound on player phones.
- Keep images well under 1 MB each after cropping so the static bundle stays light.
- Shuffle the answer choices at runtime so the correct one is not always first.
- If a question flops on the night, the host Skip button drops it. That is what the 2 spare questions are for.

## Easy Ways to Extend Later

Good, crowd-friendly birds to add if you want more: Northern Cardinal, Blue Jay, Mallard, Canada Goose, Pelican, Penguin, Ostrich, Bald Eagle, Robin, Owl (Great Horned), Hummingbird, Woodpecker. All have plentiful CC photos and xeno-canto recordings.
