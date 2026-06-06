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

Bird photos for Name That Bird are staged in `public/birds/`:

- `puffin.jpg` - Atlantic Puffin, iNaturalist CC BY photo by Diego Gonzalez Dopico.
- `flamingo.jpg` - Greater Flamingo, iNaturalist CC0 photo by karim Attouche.
- `peacock.jpg` - Indian Peafowl, iNaturalist CC BY photo by Brooke J.
- `toucan.jpg` - Toco Toucan, iNaturalist CC0 photo by Paulo Mascaretti.
- `cardinal.jpg` - Northern Cardinal, Wikimedia Commons CC BY-SA photo by Rhododendrites.
- `blue_jay.jpg` - Blue Jay, Wikimedia Commons CC BY-SA photo by Mdf.
- `mallard.jpg` - Mallard, iNaturalist CC0 photo by MadMagpie.
- `bald_eagle.jpg` - Bald Eagle, iNaturalist CC0 photo by Ben.

Bird calls for Name That Call are staged in `public/calls/`:

- `loon.mp3` - Common Loon. Source: xeno-canto `XC479757`, Sunny Tseng.
- `barred_owl.mp3` - Barred Owl. Source: xeno-canto `XC602835`, Steve Hampton.
- `mourning_dove.mp3` - Mourning Dove. Source: xeno-canto `XC354052`, Lance A. M. Benner.
- `american_robin.mp3` - American Robin. Source: xeno-canto `XC909143`, Thomas Ryder Payne.
- `red_winged_blackbird.mp3` - Red-winged Blackbird. Source: xeno-canto `XC557143`, Josh Barron.
- `herring_gull.mp3` - American Herring Gull. Source: xeno-canto `XC636548`, Thomas Ryder Payne.

See `CREDITS.md` for source links and license notes. See `docs/ASSET_MAP.md` for runtime usage. Before any public deployment, confirm the current license on each source page.

## Gameplay Wiring

- Replace permissive demo RLS with tighter room-aware policies if this ever leaves the private party context.
- Add runtime answer-choice shuffling so the correct answer is not always in the same position.
- Add host kick/duplicate cleanup controls.
- Add final superlatives.
