import type { GameStatus } from "@/types/game";

export const MUSIC_MODE_EVENT = "fowl-play:music-mode";
export const MUSIC_UNLOCK_KEY = "fowl-play-music-unlocked";

export const MUSIC_TRACKS = {
  intro: "/music/intro_theme.mp3",
  main: "/music/main_theme.mp3",
} as const;

export type MusicMode = keyof typeof MUSIC_TRACKS;

export function musicModeForStatus(status?: GameStatus | null): MusicMode {
  return status && status !== "lobby" ? "main" : "intro";
}
