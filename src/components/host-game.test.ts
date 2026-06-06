import { describe, expect, it } from "vitest";
import { advanceLabel, statusLabel } from "@/components/host-game";

describe("host game labels", () => {
  it("displays human-readable status labels", () => {
    expect(statusLabel("question_intro")).toBe("Question Intro");
    expect(statusLabel("scoreboard")).toBe("Scoreboard");
    expect(statusLabel("finished")).toBe("Finished");
  });

  it("turns the finished primary action into a replay action", () => {
    expect(advanceLabel("finished")).toBe("Play again");
  });
});
