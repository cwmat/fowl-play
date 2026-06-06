import { describe, expect, it } from "vitest";
import { scoreAnswer } from "@/lib/scoring";

describe("scoreAnswer", () => {
  it("awards no points for wrong answers", () => {
    expect(
      scoreAnswer({
        isCorrect: false,
        answeredAtMs: 1_000,
        questionStartedAtMs: 0,
        timeLimitMs: 15_000,
      }),
    ).toBe(0);
  });

  it("awards the full speed bonus for an instant correct answer", () => {
    expect(
      scoreAnswer({
        isCorrect: true,
        answeredAtMs: 0,
        questionStartedAtMs: 0,
        timeLimitMs: 15_000,
      }),
    ).toBe(1300);
  });

  it("keeps late correct answers at the base score", () => {
    expect(
      scoreAnswer({
        isCorrect: true,
        answeredAtMs: 20_000,
        questionStartedAtMs: 0,
        timeLimitMs: 15_000,
      }),
    ).toBe(1000);
  });
});
