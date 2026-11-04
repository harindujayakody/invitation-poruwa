"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface WeddingMusicPlayerProps {
  className?: string;
  autoPlay?: boolean;
}

export function WeddingMusicPlayer({ className = "" }: WeddingMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Synthesize traditional ceremonial pentatonic flute tones (Raga Kalyani / Mohanam notes used in Sri Lankan weddings)
  const playFluteTone = (freq: number, duration: number, delay: number = 0) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm sine with soft flute harmonics
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle envelope: soft attack, sustained breath, gentle release
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // AudioContext may be suspended or blocked by user gesture
      }
    }, delay * 1000);
  };

  const playCeremonialMelody = () => {
    // Sri Lankan wedding auspicious notes: Sa, Ri, Ga, Pa, Dha
    const notes = [
      { freq: 440.0, dur: 0.6, delay: 0 },    // A4 (Sa)
      { freq: 493.88, dur: 0.5, delay: 0.5 }, // B4 (Ri)
      { freq: 554.37, dur: 0.8, delay: 1.0 }, // C#5 (Ga)
      { freq: 659.25, dur: 0.7, delay: 1.8 }, // E5 (Pa)
      { freq: 554.37, dur: 0.5, delay: 2.5 }, // C#5 (Ga)
      { freq: 493.88, dur: 0.9, delay: 3.0 }, // B4 (Ri)
      { freq: 440.0, dur: 1.2, delay: 3.9 },  // A4 (Sa)
    ];

    notes.forEach((n) => playFluteTone(n.freq, n.dur, n.delay));
  };

  const toggleMusic = () => {
    if (!isPlaying) {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      playCeremonialMelody();
      intervalRef.current = setInterval(() => {
        playCeremonialMelody();
      }, 5500);

      setIsPlaying(true);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleMusic}
      title={isPlaying ? "Mute ceremonial music" : "Play ceremonial wedding music"}
      aria-label={isPlaying ? "Mute music" : "Play ceremonial music"}
      className={`group relative flex items-center justify-center rounded-full p-2.5 transition-all duration-300 shadow-md ${
        isPlaying
          ? "bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-2 scale-105"
          : "bg-amber-100/90 text-amber-800 hover:bg-amber-200 border border-amber-300/80"
      } ${className}`}
      style={{ minHeight: "44px", minWidth: "44px" }}
    >
      {isPlaying ? (
        <>
          <Volume2 className="h-4 w-4 animate-pulse" strokeWidth={1.5} />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </>
      ) : (
        <VolumeX className="h-4 w-4 opacity-75 group-hover:opacity-100" strokeWidth={1.5} />
      )}
    </button>
  );
}
