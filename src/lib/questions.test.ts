import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { questions } from "@/lib/questions";

const projectRoot = process.cwd();

describe("question bank", () => {
  it("contains the intended short-party question count and mix", () => {
    expect(questions).toHaveLength(24);
    expect(questions.filter((question) => question.type === "multiple_choice")).toHaveLength(10);
    expect(questions.filter((question) => question.type === "name_that_bird")).toHaveLength(8);
    expect(questions.filter((question) => question.type === "name_that_call")).toHaveLength(6);
  });

  it("keeps answer indexes inside each choice set", () => {
    for (const question of questions) {
      expect(question.choices).toHaveLength(4);
      expect(question.answer_index).toBeGreaterThanOrEqual(0);
      expect(question.answer_index).toBeLessThan(question.choices.length);
    }
  });

  it("spreads correct answers across every answer slot", () => {
    const answerSlotCounts = questions.reduce(
      (counts, question) => {
        counts[question.answer_index] += 1;
        return counts;
      },
      [0, 0, 0, 0],
    );

    expect(answerSlotCounts).toEqual([6, 6, 6, 6]);
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
