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

- `puffin.jpg` - Atlantic Puffin, iNaturalist CC BY photo by Diego González Dopico.
- `flamingo.jpg` - Greater Flamingo, iNaturalist CC0 photo by karim Attouche.
- `peacock.jpg` - Indian Peafowl, iNaturalist CC BY photo by Brooke J.
- `toucan.jpg` - Toco Toucan, iNaturalist CC0 photo by Paulo Mascaretti.

Bird calls for Name That Call are staged in `public/calls/`:

- `loon.mp3` - Common Loon. Plan source: xeno-canto `XC479757`, Sunny Tseng.
- `barred_owl.mp3` - Barred Owl. Plan source: xeno-canto `XC602835`, Steve Hampton.
- `mourning_dove.mp3` - Mourning Dove. Plan source: xeno-canto `XC354052`, Lance A.M. Benner.

See `CREDITS.md` for source links and license notes. Before any public deployment, confirm the current license on each source page.

## Gameplay Wiring

- Replace permissive demo RLS with tighter room-aware policies if this ever leaves the private party context.
- Add real image/audio rendering for the media rounds now that files exist.
- Add host kick/duplicate cleanup controls.
- Add final superlatives.
