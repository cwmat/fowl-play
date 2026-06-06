import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MUSIC_TRACKS, musicModeForStatus } from "@/lib/music";

const projectRoot = process.cwd();

describe("game music", () => {
  it("uses the staged intro and main themes", () => {
    expect(MUSIC_TRACKS).toEqual({
      intro: "/music/intro_theme.mp3",
      main: "/music/main_theme.mp3",
    });
  });

  it("keeps lobby on the intro theme and active games on the main theme", () => {
    expect(musicModeForStatus()).toBe("intro");
    expect(musicModeForStatus("lobby")).toBe("intro");
    expect(musicModeForStatus("question_intro")).toBe("main");
    expect(musicModeForStatus("answering")).toBe("main");
    expect(musicModeForStatus("reveal")).toBe("main");
    expect(musicModeForStatus("scoreboard")).toBe("main");
    expect(musicModeForStatus("finished")).toBe("main");
  });

  it("has every referenced music track in public assets", () => {
    for (const musicPath of Object.values(MUSIC_TRACKS)) {
      const localPath = join(projectRoot, "public", musicPath.replace(/^\//, ""));
      expect(existsSync(localPath), musicPath).toBe(true);
    }
  });
});
