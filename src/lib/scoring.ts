const BASE_POINTS = 1000;
const MAX_SPEED_BONUS = 300;

export function scoreAnswer({
  isCorrect,
  answeredAtMs,
  questionStartedAtMs,
  timeLimitMs,
}: {
  isCorrect: boolean;
  answeredAtMs: number;
  questionStartedAtMs: number;
  timeLimitMs: number;
}) {
  if (!isCorrect) {
    return 0;
  }

  const elapsed = Math.max(0, answeredAtMs - questionStartedAtMs);
  const remainingRatio = Math.max(0, Math.min(1, 1 - elapsed / timeLimitMs));
  return BASE_POINTS + Math.round(MAX_SPEED_BONUS * remainingRatio);
}
