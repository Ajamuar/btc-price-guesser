"use client";

import { Button } from "@/components/ui/button";

type GuessButtonsProps = {
  hasPendingGuess: boolean;
  onGuess: (direction: "up" | "down", priceAtGuess: number) => void;
  currentPrice: number | null;
  loading?: boolean;
};

export function GuessButtons({
  hasPendingGuess,
  onGuess,
  currentPrice,
  loading = false,
}: GuessButtonsProps) {
  const canSubmit = !hasPendingGuess && !loading && currentPrice !== null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <Button
          size="lg"
          variant="outline"
          disabled={!canSubmit}
          onClick={() => currentPrice !== null && onGuess("up", currentPrice)}
        >
          Up
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={!canSubmit}
          onClick={() => currentPrice !== null && onGuess("down", currentPrice)}
        >
          Down
        </Button>
      </div>
      {loading && (
        <p className="text-xs text-muted-foreground">Submitting…</p>
      )}
      {hasPendingGuess && !loading && (
        <p className="text-xs text-muted-foreground">
          Waiting for resolution…
        </p>
      )}
    </div>
  );
}
