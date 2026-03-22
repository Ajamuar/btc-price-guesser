"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WAITING_KEYS = [
  "waiting0",
  "waiting1",
  "waiting2",
  "waiting3",
  "waiting4",
  "waiting5",
  "waiting6",
  "waiting7",
] as const;

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
  const t = useTranslations("GuessButtons");
  const canSubmit = !hasPendingGuess && !loading && currentPrice !== null;

  const [waitingMessage, setWaitingMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!hasPendingGuess || loading) {
      setWaitingMessage(null);
      return;
    }
    const key = WAITING_KEYS[Math.floor(Math.random() * WAITING_KEYS.length)];
    setWaitingMessage(t(key));
  }, [hasPendingGuess, loading, t]);

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
          aria-label={t("upAria")}
          className={cn(
            "text-sm sm:text-base",
            selectedDirection === "up"
              ? "bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
              : "border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/50"
          )}
        >
          {t("up")}
        </Button>
        <Button
          size="lg"
          variant={selectedDirection === "down" ? "default" : "outline"}
          disabled={!canSubmit}
          onClick={() => currentPrice !== null && onGuess("down", currentPrice)}
          aria-label={t("downAria")}
          className={cn(
            "text-sm sm:text-base",
            selectedDirection === "down"
              ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-600 dark:hover:bg-red-700"
              : "border-red-600 text-red-600 hover:bg-red-50 dark:border-red-500 dark:text-red-400 dark:hover:bg-red-950/50"
          )}
        >
          {t("down")}
        </Button>
      </div>
      {loading && (
        <p className="text-xs text-muted-foreground">{t("submitting")}</p>
      )}
      {hasPendingGuess && !loading && waitingMessage && (
        <p className="text-xs text-muted-foreground">{waitingMessage}</p>
      )}
    </div>
  );
}
