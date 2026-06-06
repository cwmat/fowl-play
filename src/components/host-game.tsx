"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Plus, SkipForward, Trophy } from "lucide-react";
import { AvatarTile } from "@/components/avatar-tile";
import { QRCodePanel } from "@/components/qr-code";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createRoomCode } from "@/lib/room-code";
import { scoreAnswer } from "@/lib/scoring";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { questions } from "@/lib/questions";
import type { Answer, Game, GameStatus, Player } from "@/types/game";

const HOST_GAME_KEY = "fowl-play-host-game-id";
const QUESTION_TIME_LIMIT_MS = 15_000;

export function HostGame({ siteUrl }: { siteUrl: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const currentQuestion = questions[game?.current_q_index ?? 0] ?? questions[0];
  const currentAnswers = answers.filter(
    (answer) => answer.q_index === game?.current_q_index,
  );
  const answeredCount = new Set(currentAnswers.map((answer) => answer.player_id)).size;
  const joinUrl = game ? `${siteUrl}/play/${game.room_code}` : `${siteUrl}/play`;
  const remainingMs =
    game?.status === "answering" && game.question_started_at
      ? Math.max(0, QUESTION_TIME_LIMIT_MS - (now - Date.parse(game.question_started_at)))
      : QUESTION_TIME_LIMIT_MS;

  const loadGameData = useCallback(
    async (gameId: string) => {
      if (!supabase) {
        return;
      }

      const [{ data: gameRow, error: gameError }, { data: playerRows }, { data: answerRows }] =
        await Promise.all([
          supabase.from("games").select("*").eq("id", gameId).maybeSingle(),
          supabase.from("players").select("*").eq("game_id", gameId).order("joined_at"),
          supabase.from("answers").select("*").eq("game_id", gameId),
        ]);

      if (gameError) {
        setError(gameError.message);
        return;
      }

      if (!gameRow) {
        window.localStorage.removeItem(HOST_GAME_KEY);
        return;
      }

      setGame(gameRow as Game);
      setPlayers((playerRows ?? []) as Player[]);
      setAnswers((answerRows ?? []) as Answer[]);
    },
    [supabase],
  );

  const createGame = useCallback(async () => {
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local and restart npm run dev.");
      return;
    }

    setBusy(true);
    setError(null);

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const roomCode = createRoomCode();
      const { data, error: insertError } = await supabase
        .from("games")
        .insert({ room_code: roomCode, status: "lobby", current_q_index: 0 })
        .select()
        .single();

      if (!insertError && data) {
        window.localStorage.setItem(HOST_GAME_KEY, data.id);
        setGame(data as Game);
        setPlayers([]);
        setAnswers([]);
        setBusy(false);
        return;
      }

      if (!insertError?.message.toLowerCase().includes("duplicate")) {
        setError(insertError?.message ?? "Could not create game.");
        setBusy(false);
        return;
      }
    }

    setError("Could not find an unused room code. Try again.");
    setBusy(false);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const existingGameId = window.localStorage.getItem(HOST_GAME_KEY);

      if (existingGameId) {
        void loadGameData(existingGameId);
      } else {
        void createGame();
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [createGame, loadGameData, supabase]);

  useEffect(() => {
    if (!supabase || !game) {
      return;
    }

    const channel = supabase
      .channel(`host-game-${game.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games", filter: `id=eq.${game.id}` },
        (payload) => setGame(payload.new as Game),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `game_id=eq.${game.id}` },
        () => void loadGameData(game.id),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "answers", filter: `game_id=eq.${game.id}` },
        () => void loadGameData(game.id),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [game, loadGameData, supabase]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!game || game.status !== "answering" || remainingMs > 0) {
      return;
    }

    void advanceGame();
    // The timer effect intentionally watches rendered timer state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, remainingMs]);

  async function updateGame(fields: Partial<Game>) {
    if (!supabase || !game) {
      return;
    }

    setBusy(true);
    const { error: updateError } = await supabase.from("games").update(fields).eq("id", game.id);
    setBusy(false);

    if (updateError) {
      setError(updateError.message);
    }
  }

  async function scoreCurrentQuestion() {
    if (!supabase || !game || !currentQuestion) {
      return;
    }

    const { data: freshAnswers, error: answersError } = await supabase
      .from("answers")
      .select("*")
      .eq("game_id", game.id)
      .eq("q_index", game.current_q_index);

    if (answersError) {
      setError(answersError.message);
      return;
    }

    const deltas = new Map<string, number>();
    const startedAt = game.question_started_at
      ? Date.parse(game.question_started_at)
      : Date.now();

    for (const answer of (freshAnswers ?? []) as Answer[]) {
      const isCorrect = Number(answer.choice) === currentQuestion.answer_index;
      const points =
        answer.is_correct === null
          ? scoreAnswer({
              isCorrect,
              answeredAtMs: Date.parse(answer.answered_at),
              questionStartedAtMs: startedAt,
              timeLimitMs: QUESTION_TIME_LIMIT_MS,
            })
          : answer.points_awarded;

      await supabase
        .from("answers")
        .update({ is_correct: isCorrect, points_awarded: points })
        .eq("id", answer.id);

      if (answer.is_correct === null && points > 0) {
        deltas.set(answer.player_id, (deltas.get(answer.player_id) ?? 0) + points);
      }
    }

    for (const [playerId, delta] of deltas) {
      const player = players.find((item) => item.id === playerId);

      if (player) {
        await supabase
          .from("players")
          .update({ score: player.score + delta })
          .eq("id", playerId);
      }
    }
  }

  async function advanceGame() {
    if (!game) {
      return;
    }

    const nextStatusByStatus: Record<GameStatus, GameStatus> = {
      lobby: "question_intro",
      question_intro: "answering",
      answering: "reveal",
      reveal: "scoreboard",
      scoreboard: "question_intro",
      finished: "finished",
    };

    if (game.status === "answering") {
      await scoreCurrentQuestion();
    }

    if (game.status === "scoreboard") {
      const nextIndex = game.current_q_index + 1;

      if (nextIndex >= questions.length) {
        await updateGame({ status: "finished" });
      } else {
        await updateGame({
          status: "question_intro",
          current_q_index: nextIndex,
          question_started_at: null,
        });
      }
      return;
    }

    await updateGame({
      status: nextStatusByStatus[game.status],
      question_started_at:
        game.status === "question_intro" ? new Date().toISOString() : game.question_started_at,
    });
  }

  async function skipQuestion() {
    if (!game) {
      return;
    }

    const nextIndex = game.current_q_index + 1;
    await updateGame({
      status: nextIndex >= questions.length ? "finished" : "question_intro",
      current_q_index: Math.min(nextIndex, questions.length - 1),
      question_started_at: null,
    });
  }

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8 lg:px-10">
      <section className="mx-auto grid max-w-7xl gap-5 xl:grid-cols-[380px_1fr]">
        <Card className="bg-paper p-5">
          <Badge className="mb-4 bg-party-yellow">Host lobby</Badge>
          {game ? (
            <QRCodePanel value={joinUrl} label={game.room_code} />
          ) : (
            <div className="border-4 border-ink bg-white p-6 text-xl font-black shadow-[6px_6px_0_#111]">
              Creating room...
            </div>
          )}
          <div className="mt-5 grid gap-3">
            <Button className="bg-party-green" disabled={busy || !game} onClick={advanceGame}>
              <Play aria-hidden="true" />
              {advanceLabel(game?.status)}
            </Button>
            <Button className="bg-party-orange" disabled={busy || !game} onClick={skipQuestion}>
              <SkipForward aria-hidden="true" />
              Skip
            </Button>
            <Button className="bg-white" disabled={busy} onClick={createGame}>
              <Plus aria-hidden="true" />
              New room
            </Button>
          </div>
          {!supabase ? (
            <p className="mt-4 font-bold text-red-700">
              Supabase env vars are missing. Check .env.local and restart npm run dev.
            </p>
          ) : null}
          {error ? <p className="mt-4 font-bold text-red-700">{error}</p> : null}
        </Card>

        <div className="grid gap-5">
          <Card className="bg-white p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <Badge className="bg-party-blue">{game?.status ?? "loading"}</Badge>
              <span className="border-4 border-ink bg-party-yellow px-4 py-2 text-2xl font-black shadow-[4px_4px_0_#111]">
                {Math.ceil(remainingMs / 1000)}s
              </span>
            </div>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">
              {currentQuestion.prompt}
            </h1>
            <p className="mt-4 text-xl font-black">
              {answeredCount}/{players.length} locked in
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {currentQuestion.choices.map((choice, index) => {
                const isReveal = game?.status === "reveal" || game?.status === "scoreboard";
                const isCorrect = index === currentQuestion.answer_index;

                return (
                  <div
                    className={`border-4 border-ink p-4 text-2xl font-black shadow-[5px_5px_0_#111] ${
                      isReveal && isCorrect ? "bg-party-green" : "bg-paper"
                    }`}
                    key={choice}
                  >
                    {String.fromCharCode(65 + index)}. {choice}
                  </div>
                );
              })}
            </div>
            {game?.status === "reveal" || game?.status === "scoreboard" ? (
              <p className="mt-5 border-4 border-ink bg-party-yellow p-4 text-2xl font-black shadow-[5px_5px_0_#111]">
                {currentQuestion.fun_fact}
              </p>
            ) : null}
          </Card>

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Card className="bg-party-green p-5">
              <h2 className="mb-4 text-3xl font-black">Flock roster</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {players.length > 0 ? (
                  players.map((player) => (
                    <AvatarTile
                      avatarId={player.avatar}
                      className="min-w-0"
                      key={player.id}
                      size="sm"
                    />
                  ))
                ) : (
                  <p className="col-span-full text-xl font-black">
                    Waiting for birds to join.
                  </p>
                )}
              </div>
            </Card>

            <Card className="bg-party-pink p-5">
              <Trophy className="mb-4 h-10 w-10" aria-hidden="true" />
              <h2 className="text-3xl font-black">Leaderboard</h2>
              <div className="mt-4 grid gap-3">
                {[...players]
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      className="border-4 border-ink bg-white p-3 font-black shadow-[3px_3px_0_#111]"
                      key={player.id}
                    >
                      {index + 1}. {player.name} - {player.score}
                    </div>
                  ))}
              </div>
              {game?.status === "finished" ? (
                <Badge className="mt-4 bg-party-yellow">Final results</Badge>
              ) : null}
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function advanceLabel(status?: GameStatus) {
  switch (status) {
    case "lobby":
      return "Start";
    case "question_intro":
      return "Open answers";
    case "answering":
      return "Reveal";
    case "reveal":
      return "Scoreboard";
    case "scoreboard":
      return "Next";
    case "finished":
      return "Finished";
    default:
      return "Loading";
  }
}
