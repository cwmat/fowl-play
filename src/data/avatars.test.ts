import { describe, expect, it } from "vitest";
import { avatars } from "@/data/avatars";

describe("avatars", () => {
  it("offers twelve playable bird characters", () => {
    expect(avatars).toHaveLength(12);
  });

  it("keeps avatar ids, initials, and files unique", () => {
    expect(new Set(avatars.map((avatar) => avatar.id)).size).toBe(avatars.length);
    expect(new Set(avatars.map((avatar) => avatar.initials)).size).toBe(avatars.length);
    expect(new Set(avatars.map((avatar) => avatar.file)).size).toBe(avatars.length);
  });

  it("points every avatar at the public avatars folder", () => {
    for (const avatar of avatars) {
      expect(avatar.file).toMatch(/^\/avatars\/[a-z_]+\.png$/);
    }
  });
});
