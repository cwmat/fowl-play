import { Bird, Gamepad2, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JoinRoomForm } from "@/components/join-room-form";
import { questions } from "@/lib/questions";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Badge className="bg-party-yellow">Living room quiz kit</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-6xl font-black leading-none text-ink sm:text-7xl lg:text-8xl">
              FOWL PLAY
            </h1>
            <p className="max-w-2xl text-xl font-bold leading-8 sm:text-2xl">
              Host the TV game, let everyone join from their phones, and run a
              short chaotic bird trivia party with zero accounts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/host" size="lg" className="bg-party-pink">
              <Gamepad2 aria-hidden="true" />
              Host a game
            </ButtonLink>
            <ButtonLink href="/play" size="lg" className="bg-party-blue">
              <Smartphone aria-hidden="true" />
              Join from phone
            </ButtonLink>
          </div>
        </div>

        <Card className="bg-paper p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4 border-b-4 border-ink pb-4">
            <div>
              <p className="text-sm font-black uppercase">Scaffold loaded</p>
              <h2 className="text-3xl font-black">Tonight&apos;s flight plan</h2>
            </div>
            <Bird className="h-12 w-12" aria-hidden="true" />
          </div>

          <div className="grid gap-3 py-5">
            <StatusRow label="Questions seeded" value={`${questions.length}`} color="bg-party-green" />
            <StatusRow label="Round types" value="3" color="bg-party-blue" />
            <StatusRow label="Realtime target" value="Supabase" color="bg-party-pink" />
          </div>

          <JoinRoomForm />
        </Card>
      </section>
    </main>
  );
}

function StatusRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-4 border-ink bg-white p-4 shadow-[4px_4px_0_#111]">
      <span className="text-lg font-black">{label}</span>
      <span className={`${color} border-4 border-ink px-3 py-1 text-xl font-black`}>
        {value}
      </span>
    </div>
  );
}
