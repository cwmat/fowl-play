import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { questions } from "@/lib/questions";

const projectRoot = process.cwd();

describe("question bank", () => {
  it("contains the intended short-party question count and mix", () => {
    expect(questions).toHaveLength(12);
    expect(questions.filter((question) => question.type === "multiple_choice")).toHaveLength(5);
    expect(questions.filter((question) => question.type === "name_that_bird")).toHaveLength(4);
    expect(questions.filter((question) => question.type === "name_that_call")).toHaveLength(3);
  });

  it("keeps answer indexes inside each choice set", () => {
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(question.answer_index).toBeGreaterThanOrEqual(0);
      expect(question.answer_index).toBeLessThan(question.choices.length);
    }
  });

  it("has local files for every referenced media asset", () => {
    const mediaPaths = questions.flatMap((question) =>
      [question.media.image, question.media.audio].filter(Boolean),
    );

    expect(mediaPaths.length).toBeGreaterThan(0);

    for (const mediaPath of mediaPaths) {
      const localPath = join(projectRoot, "public", mediaPath!.replace(/^\//, ""));
      expect(existsSync(localPath), mediaPath!).toBe(true);
    }
  });
});
