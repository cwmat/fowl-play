import type { AvatarId } from "@/data/avatars";

export type GameStatus =
  | "lobby"
  | "question_intro"
  | "answering"
  | "reveal"
  | "scoreboard"
  | "finished";

export type QuestionType =
  | "multiple_choice"
  | "name_that_bird"
  | "name_that_call";

export type Question = {
  id: string;
  type: QuestionType;
  prompt: string;
  media: {
    image: string | null;
    audio: string | null;
  };
  choices: string[];
  answer_index: number;
  fun_fact: string;
  difficulty: 1 | 2 | 3;
};

export type Player = {
  id: string;
  game_id: string;
  name: string;
  avatar: AvatarId;
  score: number;
  last_seen: string;
  joined_at: string;
};

export type Game = {
  id: string;
  room_code: string;
  status: GameStatus;
  current_q_index: number;
  question_started_at: string | null;
  created_at: string;
};

export type Answer = {
  id: string;
  game_id: string;
  player_id: string;
  q_index: number;
  choice: string;
  is_correct: boolean | null;
  points_awarded: number;
  answered_at: string;
};
