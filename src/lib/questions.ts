import questionsJson from "../../public/questions.json";
import type { Question } from "@/types/game";

export const questions = questionsJson as Question[];

export function getQuestion(index: number) {
  return questions[index] ?? null;
}
