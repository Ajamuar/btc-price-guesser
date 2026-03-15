"use client";

import { useHistory } from "@/hooks/use-history";

function formatTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function formatPrice(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

type HistoryTabProps = {
  refetchTrigger?: number;
};

export function HistoryTab({ refetchTrigger }: HistoryTabProps) {
  const { history, loading, error } = useHistory(50, refetchTrigger);

  if (loading) {
    return (
      <p className="py-4 text-sm text-muted-foreground">Loading history…</p>
    );
  }
  if (error) {
    return (
      <p className="py-4 text-sm text-destructive">{error}</p>
    );
  }
  if (!history.length) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No guesses yet. Make a guess to see your history here!
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2 py-2">
      {history.map((item, index) => (
        <li
          key={`${item.timestamp}-${index}`}
          className="rounded-md border border-border/60 px-2 py-2 text-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
            <span className="font-medium capitalize">{item.direction}</span>
            <span
              className={
                item.result === "win"
                  ? "text-green-600 dark:text-green-400"
                  : item.result === "loss"
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
              }
            >
              {item.result === "win" ? "Win" : item.result === "loss" ? "Loss" : "Tie"}
            </span>
          </div>
          <p className="mt-0.5 text-muted-foreground">
            ${formatPrice(item.priceAtGuess)} → ${formatPrice(item.priceAtResolution)} · Score after: {item.scoreAfter}
          </p>
          <p className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</p>
        </li>
      ))}
    </ul>
  );
}
