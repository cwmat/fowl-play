# FOWL PLAY - Question Bank and Media Sources

24 questions are currently shipped in `public/questions.json`. Mix: 10 multiple choice, 8 Name That Bird photo rounds, and 6 Name That Call audio rounds.

Facts are written fresh for this project. Photos and audio have licenses, noted below. For a private party, NonCommercial audio licenses are fine. Before a public/commercial deployment, re-check every source page and license.

---

## Multiple Choice

1. **Which of these birds can fly backwards?** -> Hummingbird
2. **What do you call a group of crows?** -> A murder
3. **Which bird is the fastest animal on Earth when diving?** -> Peregrine Falcon
4. **That fierce screech an eagle makes in the movies is usually dubbed from which bird?** -> Red-tailed Hawk
5. **About how far can an owl rotate its head?** -> 270 degrees
6. **Which bird makes the longest regular migration on Earth?** -> Arctic Tern
7. **Which living bird lays the largest eggs?** -> Ostrich
8. **Which bird is famous for mimicking camera shutters, chainsaws, and other wild sounds?** -> Superb Lyrebird
9. **Which bird is known for shaping tools to fish food out of tight spaces?** -> New Caledonian Crow
10. **Which bird feeds its chicks a milk-like food made in its crop?** -> Pigeon

## Name That Bird

11. Atlantic Puffin - `public/birds/puffin.jpg`
12. Flamingo - `public/birds/flamingo.jpg`
13. Peacock - `public/birds/peacock.jpg`
14. Toucan - `public/birds/toucan.jpg`
15. Northern Cardinal - `public/birds/cardinal.jpg`
16. Blue Jay - `public/birds/blue_jay.jpg`
17. Mallard - `public/birds/mallard.jpg`
18. Bald Eagle - `public/birds/bald_eagle.jpg`

## Name That Call

19. Common Loon - `public/calls/loon.mp3`
20. Barred Owl - `public/calls/barred_owl.mp3`
21. Mourning Dove - `public/calls/mourning_dove.mp3`
22. American Robin - `public/calls/american_robin.mp3`
23. Red-winged Blackbird - `public/calls/red_winged_blackbird.mp3`
24. American Herring Gull - `public/calls/herring_gull.mp3`

---

## Photo Sources

Download to `public/birds/`. Always open the file's page, confirm the current license, and note the author for credits. Crop to a clean square for the TV.

| Question | Bird | Local file | Source | License |
|----------|------|------------|--------|---------|
| q006 | Atlantic Puffin | `puffin.jpg` | https://www.inaturalist.org/observations/277865524 | CC BY |
| q007 | Greater Flamingo | `flamingo.jpg` | https://www.inaturalist.org/observations/61500462 | CC0 |
| q008 | Indian Peafowl | `peacock.jpg` | https://www.inaturalist.org/observations/226862836 | CC BY |
| q009 | Toco Toucan | `toucan.jpg` | https://www.inaturalist.org/observations/143502779 | CC0 |
| q018 | Northern Cardinal | `cardinal.jpg` | https://commons.wikimedia.org/wiki/File:Northern_cardinal_male_(84909).jpg | CC BY-SA 4.0 |
| q019 | Blue Jay | `blue_jay.jpg` | https://commons.wikimedia.org/wiki/File:Cyanocitta-cristata-004.jpg | CC BY-SA 3.0 |
| q020 | Mallard | `mallard.jpg` | https://www.inaturalist.org/observations/369050683 | CC0 |
| q021 | Bald Eagle | `bald_eagle.jpg` | https://www.inaturalist.org/observations/369029505 | CC0 |

## Audio Sources

Download to `public/calls/`. Trim to about 5 seconds of the clearest call. Each recording's exact license is on its page, so confirm before public use. Prefer licenses without "NoDerivs" (ND) when trimming.

| Question | Bird | Local file | Recording | Recordist | Notes |
|----------|------|------------|-----------|-----------|-------|
| q010 | Common Loon | `loon.mp3` | https://xeno-canto.org/479757 | Sunny Tseng | Iconic loon call. |
| q011 | Barred Owl | `barred_owl.mp3` | https://xeno-canto.org/602835 | Steve Hampton | Classic "who cooks for you" owl call. |
| q012 | Mourning Dove | `mourning_dove.mp3` | https://xeno-canto.org/354052 | Lance A. M. Benner | Soft coo often mistaken for an owl. |
| q022 | American Robin | `american_robin.mp3` | https://xeno-canto.org/909143 | Thomas Ryder Payne | Short alarm-call clip. |
| q023 | Red-winged Blackbird | `red_winged_blackbird.mp3` | https://xeno-canto.org/557143 | Josh Barron | Short "tiny bomb" alarm-call clip. |
| q024 | American Herring Gull | `herring_gull.mp3` | https://xeno-canto.org/636548 | Thomas Ryder Payne | Classic gull call. |

## Attribution Snippet

```text
Bird photos and sounds used under Creative Commons and public domain licenses.
Photos from iNaturalist and Wikimedia Commons; audio from xeno-canto.org.
See CREDITS.md for per-file authors, licenses, and source URLs.
```

## Build Notes

- Audio rounds play through the host TV only. Do not try to autoplay calls on player phones.
- Keep images well under 1 MB each after cropping so the static bundle stays light.
- Current bank keeps the answer key exactly as authored in JSON. A future polish pass should shuffle choices at runtime.
- If a question flops on the night, the host Skip button drops it.
