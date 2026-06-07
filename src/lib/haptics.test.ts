import { describe, expect, it, vi } from "vitest";
import {
  QUESTION_START_HAPTIC_PATTERN,
  questionStartHapticKey,
  triggerHaptic,
} from "@/lib/haptics";

describe("haptics", () => {
  it("keys question-start haptics to one buzz per game question", () => {
    expect(
      questionStartHapticKey({
        gameId: "game-1",
        qIndex: 3,
        status: "question_intro",
      }),
    ).toBe("game-1:3");
    expect(
      questionStartHapticKey({
        gameId: "game-1",
        qIndex: 3,
        status: "answering",
      }),
    ).toBe("game-1:3");
    expect(questionStartHapticKey({ gameId: "game-1", qIndex: 3, status: "lobby" })).toBeNull();
  });

  it("uses the phone vibration API when available", () => {
    const vibrate = vi.fn(() => true);

    expect(triggerHaptic(undefined, { vibrate })).toBe(true);
    expect(vibrate).toHaveBeenCalledWith(QUESTION_START_HAPTIC_PATTERN);
  });

  it("fails quietly when vibration is unavailable", () => {
    expect(triggerHaptic(undefined, {})).toBe(false);
    expect(triggerHaptic(undefined, null)).toBe(false);
  });
});
