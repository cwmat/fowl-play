import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { JoinRoomForm } from "@/components/join-room-form";

export default function PlayPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <Card className="w-full max-w-md min-w-0 bg-paper p-5">
        <Badge className="mb-4 bg-party-blue">Phone join</Badge>
        <h1 className="text-4xl font-black leading-none sm:text-5xl">Join the flock</h1>
        <p className="mt-3 text-lg font-bold">
          Enter the room code from the TV.
        </p>
        <div className="mt-6">
          <JoinRoomForm />
        </div>
      </Card>
    </main>
  );
}
