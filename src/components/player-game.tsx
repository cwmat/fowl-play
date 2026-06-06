"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { AvatarTile } from "@/components/avatar-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { avatars, type AvatarId } from "@/data/avatars";
import { MUSIC_MODE_EVENT, musicModeForStatus } from "@/lib/music";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { questions } from "@/lib/questions";
import type { Answer, Game, Player } from "@/types/game";

export function PlayerGame({ roomCode }: { roomCode: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [game, setGame] = useState<Game | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("owl");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const question = questions[game?.current_q_index ?? 0] ?? questions[0];
  const playerKey = `fowl-play-player-${roomCode}`;

  const loadGame = useCallback(async () => {
    if (!supabase) {
      setError("Supabase env vars are missing. Check .env.local and restart npm run dev.");
      return;
    }

    const { data, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("room_code", roomCode)
      .maybeSingle();

    if (gameError) {
      setError(gameError.message);
      return;
    }

    setGame((data as Game | null) ?? null);
  }, [roomCode, supabase]);

  const loadPlayer = useCallback(
    async (gameId: string, qIndex: number) => {
      if (!supabase) {
        return;
      }

      const playerId = window.localStorage.getItem(playerKey);

      if (!playerId) {
        setPlayer(null);
        setAnswer(null);
        return;
      }

      const [{ data: playerRow }, { data: answerRow }] = await Promise.all([
        supabase.from("players").select("*").eq("id", playerId).maybeSingle(),
        supabase
          .from("answers")
          .select("*")
          .eq("player_id", playerId)
          .eq("game_id", gameId)
          .eq("q_index", qIndex)
          .maybeSingle(),
      ]);

      setPlayer((playerRow as Player | null) ?? null);
      setAnswer((answerRow as Answer | null) ?? null);
    },
    [playerKey, supabase],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadGame();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadGame]);

  useEffect(() => {
    if (!game) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void loadPlayer(game.id, game.current_q_index);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [game, loadPlayer]);

  useEffect(() => {
    if (!supabase || !game) {
      return;
    }

    const channel = supabase
      .channel(`player-game-${game.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games", filter: `id=eq.${game.id}` },
        (payload) => setGame(payload.new as Game),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "answers", filter: `game_id=eq.${game.id}` },
        () => void loadPlayer(game.id, game.current_q_index),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `game_id=eq.${game.id}` },
        () => void loadPlayer(game.id, game.current_q_index),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [game, loadPlayer, supabase]);

  useEffect(() => {
    if (!supabase || !player) {
      return;
    }

    const interval = window.setInterval(() => {
      void supabase
        .from("players")
        .update({ last_seen: new Date().toISOString() })
        .eq("id", player.id);
    }, 10_000);

    return () => window.clearInterval(interval);
  }, [player, supabase]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent(MUSIC_MODE_EVENT, {
        detail: { mode: musicModeForStatus(game?.status) },
      }),
    );
  }, [game?.status]);

  async function joinGame(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase || !game) {
      return;
    }

    const cleanName = name.trim().slice(0, 12);

    if (!cleanName) {
      setError("Give your bird a name first.");
      return;
    }

    setBusy(true);
    const id = window.localStorage.getItem(playerKey) ?? crypto.randomUUID();
    const { data, error: joinError } = await supabase
      .from("players")
      .upsert({
        id,
        game_id: game.id,
        name: cleanName,
        avatar,
        last_seen: new Date().toISOString(),
      })
      .select()
      .single();
    setBusy(false);

    if (joinError) {
      setError(joinError.message);
      return;
    }

    window.localStorage.setItem(playerKey, id);
    setPlayer(data as Player);
    setError(null);
  }

  async function submitAnswer(choiceIndex: number) {
    if (!supabase || !game || !player) {
      return;
    }

    setBusy(true);
    const { data, error: answerError } = await supabase
      .from("answers")
      .upsert(
        {
          game_id: game.id,
          player_id: player.id,
          q_index: game.current_q_index,
          choice: String(choiceIndex),
          is_correct: null,
          points_awarded: 0,
        },
        { onConflict: "game_id,player_id,q_index" },
      )
      .select()
      .single();
    setBusy(false);

    if (answerError) {
      setError(answerError.message);
      return;
    }

    setAnswer(data as Answer);
  }

  if (!game) {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-5">
        <Card className="w-full max-w-md bg-paper p-5">
          <Badge className="mb-4 bg-party-orange">Room {roomCode}</Badge>
          <h1 className="text-4xl font-black">No room yet</h1>
          <p className="mt-3 text-lg font-bold">
            Ask the host to create a game, then refresh this screen.
          </p>
          {error ? <p className="mt-4 font-bold text-red-700">{error}</p> : null}
        </Card>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="min-h-screen px-4 py-5">
        <form className="mx-auto grid max-w-md gap-5" onSubmit={joinGame}>
          <Card className="bg-party-yellow p-5">
            <Badge className="mb-4 bg-white">Room {roomCode}</Badge>
            <h1 className="text-4xl font-black">Join the flock</h1>
            <label className="mt-5 block text-sm font-black uppercase" htmlFor="player-name">
              Name
            </label>
            <input
              className="mt-2 h-14 w-full border-4 border-ink bg-white px-4 text-2xl font-black shadow-[4px_4px_0_#111] outline-none focus:bg-party-blue"
              id="player-name"
              maxLength={12}
              onChange={(event) => setName(event.target.value)}
              placeholder="Bird name"
              value={name}
            />
          </Card>

          <Card className="bg-paper p-5">
            <h2 className="text-3xl font-black">Pick your bird</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {avatars.map((item) => (
                <button
                  className="text-left active:translate-x-1 active:translate-y-1"
                  key={item.id}
                  onClick={() => setAvatar(item.id)}
                  type="button"
                >
                  <AvatarTile avatarId={item.id} selected={avatar === item.id} />
                </button>
              ))}
            </div>
            <Button className="mt-5 w-full bg-party-green" disabled={busy} type="submit">
              <Check aria-hidden="true" />
              Join
            </Button>
            {error ? <p className="mt-4 font-bold text-red-700">{error}</p> : null}
          </Card>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-5">
      <section className="mx-auto grid max-w-md gap-5">
        <Card className="bg-party-yellow p-5">
          <div className="flex items-center gap-3">
            <AvatarTile avatarId={player.avatar} size="sm" />
            <div>
              <Badge className="bg-white">Room {roomCode}</Badge>
              <h1 className="mt-2 text-3xl font-black">{player.name}</h1>
              <p className="text-xl font-black">{player.score} points</p>
            </div>
          </div>
        </Card>

        <Card className="bg-paper p-5">
          <Badge className="mb-4 bg-party-pink">{game.status}</Badge>
          <h2 className="text-3xl font-black">{playerPrompt(game.status)}</h2>
          <p className="mt-3 text-xl font-black">{question.prompt}</p>

          {game.status === "answering" && !answer ? (
            <div className="mt-4 grid gap-3">
              {question.choices.map((choice, index) => (
                <button
                  className={`min-h-16 border-4 border-ink px-4 py-3 text-left text-xl font-black shadow-[4px_4px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none ${answerColor(index)}`}
                  disabled={busy}
                  key={choice}
                  onClick={() => submitAnswer(index)}
                  type="button"
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : null}

          {answer && game.status === "answering" ? (
            <div className="mt-5 border-4 border-ink bg-party-green p-5 text-center text-3xl font-black shadow-[4px_4px_0_#111]">
              Locked in
            </div>
          ) : null}

          {(game.status === "reveal" || game.status === "scoreboard") && answer ? (
            <div className="mt-5 grid gap-3">
              <div className="border-4 border-ink bg-white p-4 text-xl font-black shadow-[4px_4px_0_#111]">
                You picked: {question.choices[Number(answer.choice)]}
              </div>
              <div className="border-4 border-ink bg-party-green p-4 text-xl font-black shadow-[4px_4px_0_#111]">
                Correct: {question.choices[question.answer_index]}
              </div>
              <p className="border-4 border-ink bg-party-yellow p-4 font-black shadow-[4px_4px_0_#111]">
                {question.fun_fact}
              </p>
            </div>
          ) : null}

          {game.status === "finished" ? (
            <div className="mt-5 border-4 border-ink bg-party-green p-5 text-center text-3xl font-black shadow-[4px_4px_0_#111]">
              Final score: {player.score}
            </div>
          ) : null}

          <Button className="mt-5 w-full bg-white" onClick={() => window.location.reload()}>
            <RotateCcw aria-hidden="true" />
            Refresh
          </Button>
          {error ? <p className="mt-4 font-bold text-red-700">{error}</p> : null}
        </Card>
      </section>
    </main>
  );
}

export function playerPrompt(status: Game["status"]) {
  switch (status) {
    case "lobby":
      return "You are in. Watch the TV.";
    case "question_intro":
      return "Get ready.";
    case "answering":
      return "Choose one.";
    case "reveal":
      return "Reveal time.";
    case "scoreboard":
      return "Scoreboard on TV.";
    case "finished":
      return "Game over.";
  }
}

function answerColor(index: number) {
  return [
    "bg-party-pink",
    "bg-party-blue",
    "bg-party-yellow",
    "bg-party-green",
  ][index % 4];
}
