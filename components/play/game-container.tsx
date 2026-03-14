"use client";

import { useState } from "react";
import { LivePrice } from "@/components/play/live-price";
import { PriceChart } from "@/components/play/price-chart";
import { GuessButtonsPlaceholder } from "@/components/play/guess-buttons-placeholder";
import { useBinancePrice } from "@/hooks/use-binance-price";

type PendingGuess = {
  direction: string;
  timestamp: number;
  priceAtGuess: number;
} | null;

type GameContainerProps = {
  userDisplayName?: string | null;
  initialScore: number;
  initialPendingGuess: PendingGuess;
};

export function GameContainer({
  userDisplayName = null,
  initialScore,
  initialPendingGuess,
}: GameContainerProps) {
  const { price, priceHistory, loading, error } = useBinancePrice();

  const [score, setScore] = useState(initialScore);
  const [pendingGuess, setPendingGuess] =
    useState<PendingGuess>(initialPendingGuess);

  const priceAtGuess = pendingGuess?.priceAtGuess ?? null;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Hi {userDisplayName ?? "…"}, Let's Play
      </h1>
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <p className="text-base font-medium text-foreground">
          Score: {score}
        </p>
        <LivePrice price={price} loading={loading} error={error} />
      </div>
      <div className="w-full">
        <PriceChart data={priceHistory} priceAtGuess={priceAtGuess} />
      </div>
      <GuessButtonsPlaceholder />
    </div>
  );
}
