import { describe, expect, it } from "vitest";
import {
  QUESTION_READER_TOGGLE_KEY,
  getReaderIntroPlaybackKey,
  getQuestionReaderAudioPath,
  shouldDelayBirdCallForQuestionReader,
} from "@/lib/question-reader";

describe("question reader", () => {
  it("uses a stable host-local toggle key", () => {
    expect(QUESTION_READER_TOGGLE_KEY).toBe("fowl-play-question-reader-enabled");
  });

  it("stays quiet when reader audio has not been generated yet", () => {
    expect(getQuestionReaderAudioPath("missing-question", "intro")).toBeNull();
    expect(getQuestionReaderAudioPath("missing-question", "reveal")).toBeNull();
  });

  it("keys intro reader playback to the current game question", () => {
    expect(
      getReaderIntroPlaybackKey({
        gameId: "game-1",
        qIndex: 13,
        questionId: "q014",
        src: "/reader/q014-intro.mp3",
      }),
    ).toBe("game-1:13:q014:intro:/reader/q014-intro.mp3");

    expect(
      getReaderIntroPlaybackKey({
        gameId: null,
        qIndex: 13,
        questionId: "q014",
        src: "/reader/q014-intro.mp3",
      }),
    ).toBeNull();
  });

  it("delays bird calls only while a question intro reader clip is pending", () => {
    const key = "game-1:13:q014:intro:/reader/q014-intro.mp3";

    expect(
      shouldDelayBirdCallForQuestionReader({
        completedReaderIntroKey: null,
        hasCallAudio: true,
        readerIntroPlaybackKey: key,
        status: "question_intro",
      }),
    ).toBe(true);

    expect(
      shouldDelayBirdCallForQuestionReader({
        completedReaderIntroKey: key,
        hasCallAudio: true,
        readerIntroPlaybackKey: key,
        status: "question_intro",
      }),
    ).toBe(false);

    expect(
      shouldDelayBirdCallForQuestionReader({
        completedReaderIntroKey: null,
        hasCallAudio: true,
        readerIntroPlaybackKey: key,
        status: "answering",
      }),
    ).toBe(false);
  });
});
