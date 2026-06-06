"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCode = code.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase();

    if (cleanCode.length === 4) {
      router.push(`/play/${cleanCode}`);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <label className="text-sm font-black uppercase" htmlFor="room-code">
        Room code
      </label>
      <input
        className="h-14 border-4 border-ink bg-white px-4 text-center text-3xl font-black uppercase tracking-[0.25em] shadow-[4px_4px_0_#111] outline-none focus:bg-party-yellow"
        id="room-code"
        inputMode="text"
        maxLength={4}
        onChange={(event) => setCode(event.target.value.toUpperCase())}
        placeholder="FOWL"
        value={code}
      />
      <Button className="bg-party-blue" type="submit">
        Join room
      </Button>
    </form>
  );
}
