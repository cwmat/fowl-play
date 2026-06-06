import { describe, expect, it } from "vitest";
import { LOBBY_MODES, LOBBY_RULES, advanceLabel, statusLabel } from "@/components/host-game";

describe("host game labels", () => {
  it("displays human-readable status labels", () => {
    expect(statusLabel("question_intro")).toBe("Question Intro");
    expect(statusLabel("scoreboard")).toBe("Scoreboard");
    expect(statusLabel("finished")).toBe("Finished");
  });

  it("turns the finished primary action into a replay action", () => {
    expect(advanceLabel("finished")).toBe("Play again");
  });

  it("keeps lobby copy focused on joining and round types", () => {
    expect(LOBBY_RULES).toHaveLength(4);
    expect(LOBBY_RULES.join(" ")).toContain("Scan the room code");
    expect(LOBBY_MODES.map((mode) => mode.label)).toEqual([
      "Multiple choice",
      "Name that bird",
      "Name that call",
    ]);
  });
});
