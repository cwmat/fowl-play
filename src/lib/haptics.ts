import type { GameStatus } from "@/types/game";

export const QUESTION_START_HAPTIC_PATTERN: number[] = [80, 40, 120];

type VibrationNavigator = {
  vibrate?: (pattern: VibratePattern) => boolean;
};

export function questionStartHapticKey({
  gameId,
  qIndex,
  status,
}: {
  gameId?: string | null;
  qIndex?: number | null;
  status?: GameStatus | null;
}) {
  if (
    !gameId ||
    typeof qIndex !== "number" ||
    (status !== "question_intro" && status !== "answering")
  ) {
    return null;
  }

  return `${gameId}:${qIndex}`;
}

export function triggerHaptic(
  pattern: VibratePattern = QUESTION_START_HAPTIC_PATTERN,
  navigatorLike: VibrationNavigator | null =
    typeof navigator === "undefined" ? null : navigator,
) {
  if (typeof navigatorLike?.vibrate !== "function") {
    return false;
  }

  return navigatorLike.vibrate(pattern);
}
