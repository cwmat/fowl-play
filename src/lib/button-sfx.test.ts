import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BUTTON_SFX_PATHS, getRandomButtonSfx } from "@/lib/button-sfx";

const projectRoot = process.cwd();

describe("button sound effects", () => {
  it("uses the three staged button sounds", () => {
    expect(BUTTON_SFX_PATHS).toEqual([
      "/sfx/button_01.mp3",
      "/sfx/button_02.mp3",
      "/sfx/button_03.mp3",
    ]);
  });

  it("picks a sound from the pool based on random input", () => {
    expect(getRandomButtonSfx(() => 0)).toBe("/sfx/button_01.mp3");
    expect(getRandomButtonSfx(() => 0.34)).toBe("/sfx/button_02.mp3");
    expect(getRandomButtonSfx(() => 0.99)).toBe("/sfx/button_03.mp3");
  });

  it("has every referenced sound in public assets", () => {
    for (const sfxPath of BUTTON_SFX_PATHS) {
      const localPath = join(projectRoot, "public", sfxPath.replace(/^\//, ""));
      expect(existsSync(localPath), sfxPath).toBe(true);
    }
  });
});
