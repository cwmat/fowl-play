# Credits

FOWL PLAY uses local media assets from open-license sources. Images were downloaded as large source files and cropped/resized to 1200x1200 JPEGs for the TV view. Audio was downloaded from xeno-canto and trimmed to roughly 5 seconds for the host-only call round.

## Bird Photos

| File | Species | Photographer | License | Source |
|------|---------|--------------|---------|--------|
| `public/birds/puffin.jpg` | Atlantic Puffin | Diego Gonzalez Dopico | CC BY | https://www.inaturalist.org/observations/277865524 |
| `public/birds/flamingo.jpg` | Greater Flamingo | karim Attouche | CC0 | https://www.inaturalist.org/observations/61500462 |
| `public/birds/peacock.jpg` | Indian Peafowl | Brooke J. | CC BY | https://www.inaturalist.org/observations/226862836 |
| `public/birds/toucan.jpg` | Toco Toucan | Paulo Mascaretti | CC0 | https://www.inaturalist.org/observations/143502779 |
| `public/birds/cardinal.jpg` | Northern Cardinal | Rhododendrites | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Northern_cardinal_male_(84909).jpg |
| `public/birds/blue_jay.jpg` | Blue Jay | Mdf | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:Cyanocitta-cristata-004.jpg |
| `public/birds/mallard.jpg` | Mallard | MadMagpie | CC0 | https://www.inaturalist.org/observations/369050683 |
| `public/birds/bald_eagle.jpg` | Bald Eagle | Ben | CC0 | https://www.inaturalist.org/observations/369029505 |

## Bird Calls

| File | Species | Recordist | License Note | Source |
|------|---------|-----------|--------------|--------|
| `public/calls/loon.mp3` | Common Loon | Sunny Tseng | xeno-canto Creative Commons recording; verify current page before public deployment | https://xeno-canto.org/479757 |
| `public/calls/barred_owl.mp3` | Barred Owl | Steve Hampton | xeno-canto Creative Commons recording; verify current page before public deployment | https://xeno-canto.org/602835 |
| `public/calls/mourning_dove.mp3` | Mourning Dove | Lance A. M. Benner | CC BY-NC-SA 4.0 metadata present in source file | https://xeno-canto.org/354052 |
| `public/calls/american_robin.mp3` | American Robin | Thomas Ryder Payne | xeno-canto Creative Commons recording; verify current page before public deployment | https://xeno-canto.org/909143 |
| `public/calls/red_winged_blackbird.mp3` | Red-winged Blackbird | Josh Barron | CC BY-NC-SA 4.0 per xeno-canto page metadata | https://xeno-canto.org/557143 |
| `public/calls/herring_gull.mp3` | American Herring Gull | Thomas Ryder Payne | CC BY-NC-SA 4.0 per xeno-canto page metadata | https://xeno-canto.org/636548 |

## Music and SFX

| Folder | Notes |
|--------|-------|
| `public/music/` | User-provided intro and main loop tracks. |
| `public/sfx/` | User-provided randomized button click sounds. |

## Processing Notes

- Photos were center-cropped and resized with ffmpeg to `1200x1200` JPEG.
- Calls were trimmed/converted with ffmpeg to small MP3 clips for fast host playback.
- Keep this file updated whenever media is replaced, even for CC0 assets, so the provenance stays easy to audit.
