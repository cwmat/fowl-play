import readerManifest from "../../public/reader/manifest.json";
import type { GameStatus } from "@/types/game";

export type QuestionReaderPhase = "intro" | "reveal";

type ReaderManifest = {
  clips?: Record<string, Partial<Record<QuestionReaderPhase, string>>>;
};

const manifest = readerManifest as ReaderManifest;

export const QUESTION_READER_TOGGLE_KEY = "fowl-play-question-reader-enabled";

export function getQuestionReaderAudioPath(
  questionId: string,
  phase: QuestionReaderPhase,
) {
  return manifest.clips?.[questionId]?.[phase] ?? null;
}

export function getReaderIntroPlaybackKey({
  gameId,
  qIndex,
  questionId,
  src,
}: {
  gameId?: string | null;
  qIndex?: number | null;
  questionId: string;
  src?: string | null;
}) {
  if (!gameId || typeof qIndex !== "number" || !src) {
    return null;
  }

  return `${gameId}:${qIndex}:${questionId}:intro:${src}`;
}

export function shouldDelayBirdCallForQuestionReader({
  completedReaderIntroKey,
  hasCallAudio,
  readerIntroPlaybackKey,
  status,
}: {
  completedReaderIntroKey?: string | null;
  hasCallAudio: boolean;
  readerIntroPlaybackKey?: string | null;
  status?: GameStatus | null;
}) {
  return Boolean(
    hasCallAudio &&
      status === "question_intro" &&
      readerIntroPlaybackKey &&
      completedReaderIntroKey !== readerIntroPlaybackKey,
  );
}
