import { PlayerGame } from "@/components/player-game";

export default async function PlayRoomPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return <PlayerGame roomCode={code.toUpperCase()} />;
}
