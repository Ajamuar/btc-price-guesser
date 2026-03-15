"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type PendingGuess = {
  direction: string;
  timestamp: number;
  priceAtGuess: number;
} | null;

type LastResult = "win" | "loss" | "tie" | null;

type Resolution = { priceAtGuess: number; priceAtResolution: number };

const SIXTY_SECONDS_MS = 60_000;

export type UseGamePlayParams = {
  initialScore: number;
  initialPendingGuess: PendingGuess;
};

export type UseGamePlayReturn = {
  score: number;
  pendingGuess: PendingGuess;
  guessLoading: boolean;
  lastResult: LastResult;
  lastResolution: Resolution | null;
  nextCheckInSeconds: number | null;
  handleGuess: (direction: "up" | "down", priceAtGuess: number) => Promise<void>;
  priceAtGuess: number | null;
};

export function useGamePlay({
  initialScore,
  initialPendingGuess,
}: UseGamePlayParams): UseGamePlayReturn {
  const [score, setScore] = useState(initialScore);
  const [pendingGuess, setPendingGuess] =
    useState<PendingGuess>(initialPendingGuess);
  const [guessLoading, setGuessLoading] = useState(false);
  const [lastResult, setLastResult] = useState<LastResult>(null);
  const [lastResolution, setLastResolution] = useState<Resolution | null>(null);
  const [nextCheckInSeconds, setNextCheckInSeconds] = useState<number | null>(
    null
  );

  const scoreRef = useRef(initialScore);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  scoreRef.current = score;

  useEffect(() => {
    if (pendingGuess == null) return;

    const delayMs = Math.max(
      0,
      SIXTY_SECONDS_MS - (Date.now() - pendingGuess.timestamp)
    );

    function startPolling() {
      intervalIdRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/me");
          const text = await res.text();
          const data = text
            ? (JSON.parse(text) as {
                score?: number;
                pendingGuess?: PendingGuess;
                resolution?: Resolution;
              })
            : {};
          const newScore = data.score ?? scoreRef.current;
          const newPending = data.pendingGuess ?? null;

          if (newPending == null) {
            if (intervalIdRef.current) {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
            }
            const prevScore = scoreRef.current;
            if (newScore > prevScore) setLastResult("win");
            else if (newScore < prevScore) setLastResult("loss");
            else setLastResult("tie");
            if (data.resolution) setLastResolution(data.resolution);
          }

          setScore(newScore);
          setPendingGuess(newPending);
        } catch {
          // ignore poll errors; next tick will retry
        }
      }, 1000);
    }

    if (delayMs > 0) {
      timeoutIdRef.current = setTimeout(startPolling, delayMs);
    } else {
      startPolling();
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, [pendingGuess]);

  useEffect(() => {
    if (pendingGuess == null) {
      setNextCheckInSeconds(null);
      return;
    }
    const tick = () => {
      const elapsed = Date.now() - pendingGuess.timestamp;
      if (elapsed < SIXTY_SECONDS_MS) {
        setNextCheckInSeconds(
          Math.max(0, Math.ceil((SIXTY_SECONDS_MS - elapsed) / 1000))
        );
      } else {
        setNextCheckInSeconds(null);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [pendingGuess]);

  const handleGuess = useCallback(
    async (direction: "up" | "down", priceAtGuess: number) => {
      setLastResult(null);
      setLastResolution(null);
      setGuessLoading(true);
      try {
        const res = await fetch("/api/guess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ direction, priceAtGuess }),
        });
        const text = await res.text();
        const data = text
          ? (JSON.parse(text) as {
              score?: number;
              pendingGuess?: PendingGuess;
            })
          : {};
        if (!res.ok) return;
        setScore(data.score ?? scoreRef.current);
        setPendingGuess(data.pendingGuess ?? null);
      } catch {
        // e.g. JSON parse error or network error; leave state unchanged
      } finally {
        setGuessLoading(false);
      }
    },
    []
  );

  const priceAtGuess = pendingGuess?.priceAtGuess ?? null;

  return {
    score,
    pendingGuess,
    guessLoading,
    lastResult,
    lastResolution,
    nextCheckInSeconds,
    handleGuess,
    priceAtGuess,
  };
}
