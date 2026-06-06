import { describe, expect, it } from "vitest";
import { createRoomCode } from "@/lib/room-code";

describe("createRoomCode", () => {
  it("creates four-letter codes by default", () => {
    expect(createRoomCode()).toMatch(/^[A-Z]{4}$/);
  });

  it("avoids ambiguous letters", () => {
    for (let index = 0; index < 100; index += 1) {
      expect(createRoomCode()).not.toMatch(/[IO]/);
    }
  });

  it("supports custom code lengths", () => {
    expect(createRoomCode(6)).toMatch(/^[A-Z]{6}$/);
  });
});
