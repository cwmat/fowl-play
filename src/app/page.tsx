import Image from "next/image";
import { Gamepad2, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Badge className="bg-party-yellow">Living Room Bird Quiz</Badge>
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

        <Card className="relative aspect-square overflow-hidden bg-paper">
          <Image
            alt="Colorful bird nerd hero art with a smiling birder and illustrated birds."
            className="object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            src="/img/hero.png"
          />
        </Card>
      </section>
    </main>
  );
}
