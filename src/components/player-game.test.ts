import { describe, expect, it } from "vitest";
import { playerPrompt } from "@/components/player-game";

describe("playerPrompt", () => {
  it("keeps the phone copy aligned to each game state", () => {
    expect(playerPrompt("lobby")).toBe("You are in. Watch the TV.");
    expect(playerPrompt("question_intro")).toBe("Get ready.");
    expect(playerPrompt("answering")).toBe("Choose one.");
    expect(playerPrompt("reveal")).toBe("Reveal time.");
    expect(playerPrompt("scoreboard")).toBe("Scoreboard on TV.");
    expect(playerPrompt("finished")).toBe("Game over.");
  });
});
