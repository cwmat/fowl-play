# TODOs

## Media Assets To Revisit

Avatars are now loaded from `public/avatars/` and should use these exact names:

- `owl.png` - Grumpy Owl
- `pigeon.png` - Party Pigeon
- `flamingo.png` - Cool Flamingo
- `duck.png` - Derpy Duck
- `raven.png` - Wizard Raven
- `chicken.png` - Disco Chicken
- `penguin.png` - Buff Penguin
- `seagull.png` - Detective Seagull

Bird photos for Name That Bird should go in `public/birds/`:

- `puffin.jpg` - Atlantic Puffin. Plan source: Wikimedia Commons file `Atlantic_Puffin_in_flight.jpg` by Thomas Gansow, public domain.
- `flamingo.jpg` - Flamingo. Plan source: Wikimedia Commons `Category:Phoenicopterus`; pick a CC-BY or CC-BY-SA image and note the author.
- `peacock.jpg` - Peacock. Plan source: Wikimedia Commons `Category:Pavo_cristatus`; pick a CC-BY or CC-BY-SA image and note the author.
- `toucan.jpg` - Toucan. Plan source: Wikimedia Commons `Category:Ramphastos`; pick a CC-BY or CC-BY-SA image and note the author.

Bird calls for Name That Call should go in `public/calls/`:

- `loon.mp3` - Common Loon. Plan source: xeno-canto `XC479757`, Sunny Tseng.
- `barred_owl.mp3` - Barred Owl. Plan source: xeno-canto `XC602835`, Steve Hampton.
- `mourning_dove.mp3` - Mourning Dove. Plan source: xeno-canto `XC354052`, Lance A.M. Benner.

Before any public deployment, confirm the current license on each source page and add a `CREDITS.md` entry. For local party testing, the filenames above are enough to unblock the app.

## Gameplay Wiring

- Replace permissive demo RLS with tighter room-aware policies if this ever leaves the private party context.
- Add real image/audio rendering for the media rounds after the files above exist.
- Add host kick/duplicate cleanup controls.
- Add final superlatives.
