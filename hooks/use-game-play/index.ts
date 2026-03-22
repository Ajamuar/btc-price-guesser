"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type PendingGuess = {
  direction: string;
  timestamp: number;
  priceAtGuess: number;
} | null;

type LastResult = "win" | "loss" | "tie" | null;

type Resolution = { priceAtGuess: number; priceAtResolution: number };

export type GuessSubmitError = "network" | "server";

export type MePollError = "stopped";

const SIXTY_SECONDS_MS = 60_000;
const ME_POLL_MAX_FAILURES = 5;

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
  guessError: GuessSubmitError | null;
  mePollError: MePollError | null;
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
  const [guessError, setGuessError] = useState<GuessSubmitError | null>(null);
  const [mePollError, setMePollError] = useState<MePollError | null>(null);

  const scoreRef = useRef(initialScore);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mePollFailureCountRef = useRef(0);

  scoreRef.current = score;

  useEffect(() => {
    if (pendingGuess == null) {
      setMePollError(null);
      mePollFailureCountRef.current = 0;
    }
  }, [pendingGuess]);

  useEffect(() => {
    if (pendingGuess == null) return;

    mePollFailureCountRef.current = 0;

    const delayMs = Math.max(
      0,
      SIXTY_SECONDS_MS - (Date.now() - pendingGuess.timestamp)
    );

    function clearPollInterval() {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }

    function recordPollFailure() {
      mePollFailureCountRef.current += 1;
      if (mePollFailureCountRef.current >= ME_POLL_MAX_FAILURES) {
        clearPollInterval();
        setMePollError("stopped");
      }
    }

    function startPolling() {
      intervalIdRef.current = setInterval(async () => {
        try {
          const res = await fetch("/api/me");
          if (!res.ok) {
            recordPollFailure();
            return;
          }
          const text = await res.text();
          const data = text
            ? (JSON.parse(text) as {
                score?: number;
                pendingGuess?: PendingGuess;
                resolution?: Resolution & { result?: "win" | "loss" | "tie" };
              })
            : {};
          const newScore = data.score ?? scoreRef.current;
          const newPending = data.pendingGuess ?? null;

          mePollFailureCountRef.current = 0;
          setMePollError(null);

          if (newPending == null) {
            clearPollInterval();
            if (data.resolution) {
              setLastResolution({
                priceAtGuess: data.resolution.priceAtGuess,
                priceAtResolution: data.resolution.priceAtResolution,
              });
              setLastResult(
                data.resolution.result ??
                  (newScore > scoreRef.current
                    ? "win"
                    : newScore < scoreRef.current
                      ? "loss"
                      : "tie")
              );
            }
          }

          setScore(newScore);
          setPendingGuess(newPending);
        } catch {
          recordPollFailure();
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
      setGuessError(null);
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
        if (!res.ok) {
          setGuessError("server");
          return;
        }
        setScore(data.score ?? scoreRef.current);
        setPendingGuess(data.pendingGuess ?? null);
      } catch {
        setGuessError("network");
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
    guessError,
    mePollError,
  };
}
