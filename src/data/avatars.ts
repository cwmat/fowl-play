export const avatars = [
  { id: "owl", name: "Grumpy Owl", initials: "GO", file: "/avatars/owl.png" },
  {
    id: "pigeon",
    name: "Party Pigeon",
    initials: "PP",
    file: "/avatars/pigeon.png",
  },
  {
    id: "flamingo",
    name: "Cool Flamingo",
    initials: "CF",
    file: "/avatars/flamingo.png",
  },
  { id: "duck", name: "Derpy Duck", initials: "DD", file: "/avatars/duck.png" },
  {
    id: "raven",
    name: "Wizard Raven",
    initials: "WR",
    file: "/avatars/raven.png",
  },
  {
    id: "chicken",
    name: "Disco Chicken",
    initials: "DC",
    file: "/avatars/chicken.png",
  },
  {
    id: "penguin",
    name: "Buff Penguin",
    initials: "BP",
    file: "/avatars/penguin.png",
  },
  {
    id: "seagull",
    name: "Detective Seagull",
    initials: "DS",
    file: "/avatars/seagull.png",
  },
  {
    id: "goose",
    name: "Goth Goose",
    initials: "GG",
    file: "/avatars/goose.png",
  },
  {
    id: "parrot",
    name: "Captain Parrot",
    initials: "CP",
    file: "/avatars/parrot.png",
  },
  {
    id: "pelican",
    name: "Snacky Pelican",
    initials: "SP",
    file: "/avatars/pelican.png",
  },
  {
    id: "kiwi",
    name: "Sneaky Kiwi",
    initials: "SK",
    file: "/avatars/kiwi.png",
  },
] as const;

export type AvatarId = (typeof avatars)[number]["id"];
