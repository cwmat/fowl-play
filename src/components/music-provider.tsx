"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  MUSIC_DEFAULT_VOLUME,
  MUSIC_DUCKED_VOLUME,
  MUSIC_DUCK_EVENT,
  MUSIC_MODE_EVENT,
  MUSIC_TRACKS,
  MUSIC_UNLOCK_KEY,
  type MusicMode,
} from "@/lib/music";

type MusicModeEvent = CustomEvent<{ mode: MusicMode }>;
type MusicDuckEvent = CustomEvent<{ ducked: boolean }>;

export function MusicProvider() {
  const pathname = usePathname();
  const introRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLAudioElement>(null);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [mode, setMode] = useState<MusicMode>("intro");
  const [ducked, setDucked] = useState(false);
  const musicVolume = ducked ? MUSIC_DUCKED_VOLUME : MUSIC_DEFAULT_VOLUME;

  const getTrack = useCallback(
    (trackMode: MusicMode) => (trackMode === "intro" ? introRef.current : mainRef.current),
    [],
  );

  const pauseOtherTrack = useCallback(
    (trackMode: MusicMode) => {
      const otherTrack = getTrack(trackMode === "intro" ? "main" : "intro");

      if (otherTrack) {
        otherTrack.pause();
        otherTrack.currentTime = 0;
      }
    },
    [getTrack],
  );

  const setTrackVolumes = useCallback((volume: number) => {
    for (const track of [introRef.current, mainRef.current]) {
      if (track) {
        track.volume = volume;
      }
    }
  }, []);

  const playTrack = useCallback(
    async (trackMode: MusicMode, fromGesture = false) => {
      const track = getTrack(trackMode);

      if (!track) {
        return;
      }

      pauseOtherTrack(trackMode);
      track.loop = true;
      track.volume = musicVolume;

      try {
        await track.play();
      } catch {
        if (!fromGesture) {
          window.localStorage.removeItem(MUSIC_UNLOCK_KEY);
          window.setTimeout(() => setUnlocked(false), 0);
        }
      }
    },
    [getTrack, musicVolume, pauseOtherTrack],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setUnlocked(window.localStorage.getItem(MUSIC_UNLOCK_KEY) === "true");
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function handleMusicMode(event: Event) {
      const nextMode = (event as MusicModeEvent).detail?.mode;

      if (nextMode) {
        setMode(nextMode);
      }
    }

    window.addEventListener(MUSIC_MODE_EVENT, handleMusicMode);

    return () => window.removeEventListener(MUSIC_MODE_EVENT, handleMusicMode);
  }, []);

  useEffect(() => {
    function handleMusicDuck(event: Event) {
      setDucked(Boolean((event as MusicDuckEvent).detail?.ducked));
    }

    window.addEventListener(MUSIC_DUCK_EVENT, handleMusicDuck);

    return () => window.removeEventListener(MUSIC_DUCK_EVENT, handleMusicDuck);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (pathname === "/" || pathname === "/play" || pathname === "/host") {
        setMode("intro");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    if (!ready || !unlocked) {
      return;
    }

    void playTrack(mode);
  }, [mode, playTrack, ready, unlocked]);

  useEffect(() => {
    setTrackVolumes(musicVolume);
  }, [musicVolume, setTrackVolumes]);

  async function enterFlock() {
    window.localStorage.setItem(MUSIC_UNLOCK_KEY, "true");
    setReady(true);
    setUnlocked(true);
    await playTrack(mode, true);
  }

  return (
    <>
      <audio ref={introRef} loop preload="auto" src={MUSIC_TRACKS.intro} />
      <audio ref={mainRef} loop preload="auto" src={MUSIC_TRACKS.main} />

      {ready && !unlocked ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/95 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md border-4 border-ink bg-party-yellow p-6 text-center shadow-[8px_8px_0_#111]">
            <p className="text-sm font-black uppercase">Welcome to</p>
            <h1 className="mt-2 text-5xl font-black leading-none sm:text-6xl">FOWL PLAY</h1>
            <button
              className="mt-6 w-full border-4 border-ink bg-party-green px-5 py-4 text-2xl font-black shadow-[5px_5px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none"
              onClick={enterFlock}
              type="button"
            >
              Enter
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
