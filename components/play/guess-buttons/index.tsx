"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WAITING_MESSAGES = [
  "Waiting for the deed to happen",
  "Awaiting your fortune to change",
  "Lights, camera and money!",
  "Best poker is a poker face",
  "Life is a rollercoaster that goes up or down",
  "Bitcoin making nerds richer since 2009 - Unknown",
  "If you want proof bitcoin is real and they work, send them to me and I will use and show you",
  "Keep calm and make more guesses",
];

type GuessButtonsProps = {
  hasPendingGuess: boolean;
  selectedDirection: "up" | "down" | null;
  onGuess: (direction: "up" | "down", priceAtGuess: number) => void;
  currentPrice: number | null;
  loading?: boolean;
};

export function GuessButtons({
  hasPendingGuess,
  selectedDirection,
  onGuess,
  currentPrice,
  loading = false,
}: GuessButtonsProps) {
  const canSubmit = !hasPendingGuess && !loading && currentPrice !== null;

  const waitingMessage = useMemo(
    () =>
      WAITING_MESSAGES[
        Math.floor(Math.random() * WAITING_MESSAGES.length)
      ],
    [hasPendingGuess]
  );

  useEffect(() => {
    if (!canSubmit || currentPrice === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Node | null;
      if (
        target &&
        typeof (target as HTMLElement).closest === "function" &&
        (target as HTMLElement).closest("input, textarea, [contenteditable]")
      ) {
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onGuess("up", currentPrice);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        onGuess("down", currentPrice);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canSubmit, currentPrice, onGuess]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <Button
          size="lg"
          variant={selectedDirection === "up" ? "default" : "outline"}
          disabled={!canSubmit}
          onClick={() => currentPrice !== null && onGuess("up", currentPrice)}
          className={cn(
            "text-sm sm:text-base",
            selectedDirection === "up"
              ? "bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
              : "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/50"
          )}
        >
          Up
        </Button>
        <Button
          size="lg"
          variant={selectedDirection === "down" ? "default" : "outline"}
          disabled={!canSubmit}
          onClick={() => currentPrice !== null && onGuess("down", currentPrice)}
          className={cn(
            "text-sm sm:text-base",
            selectedDirection === "down"
              ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
              : "border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/50"
          )}
        >
          Down
        </Button>
      </div>
      {loading && (
        <p className="text-xs text-muted-foreground">Submitting…</p>
      )}
      {hasPendingGuess && !loading && (
        <p className="text-xs text-muted-foreground">{waitingMessage}</p>
      )}
    </div>
  );
}
