export const BUTTON_SFX_PATHS = [
  "/sfx/button_01.mp3",
  "/sfx/button_02.mp3",
  "/sfx/button_03.mp3",
] as const;

export function getRandomButtonSfx(random = Math.random) {
  const index = Math.floor(random() * BUTTON_SFX_PATHS.length);
  return BUTTON_SFX_PATHS[Math.min(index, BUTTON_SFX_PATHS.length - 1)];
}
