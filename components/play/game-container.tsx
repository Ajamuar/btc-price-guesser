"use client";

import { useEffect, useRef } from "react";
import { LivePrice } from "@/components/play/live-price";
import { PriceChart } from "@/components/play/price-chart";
import { GuessButtons } from "@/components/play/guess-buttons";
import { useBinancePrice } from "@/hooks/use-binance-price";
import { useGamePlay, type PendingGuess } from "@/hooks/use-game-play";

type GameContainerProps = {
  userDisplayName?: string | null;
  initialScore: number;
  initialPendingGuess: PendingGuess;
  onResolution?: () => void;
};

export function GameContainer({
  userDisplayName = null,
  initialScore,
  initialPendingGuess,
  onResolution,
}: GameContainerProps) {
  const { price, priceHistory, loading, error } = useBinancePrice();
  const {
    score,
    pendingGuess,
    guessLoading,
    lastResult,
    lastResolution,
    nextCheckInSeconds,
    handleGuess,
    priceAtGuess,
  } = useGamePlay({ initialScore, initialPendingGuess });

  const prevLastResultRef = useRef<typeof lastResult>(null);
  useEffect(() => {
    if (lastResult != null && prevLastResultRef.current === null) {
      onResolution?.();
    }
    prevLastResultRef.current = lastResult;
  }, [lastResult, onResolution]);

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
      <div className="w-full mb-6">
        <PriceChart data={priceHistory} priceAtGuess={priceAtGuess} />
      </div>
      {lastResult != null && (
        <div
          key={lastResult}
          className={`flex flex-col items-center gap-1 ${lastResult === "win" ? "result-celebration" : lastResult === "loss" ? "result-loss" : ""}`}
        >
          <p className="text-base font-medium text-foreground">
            {lastResult === "win" && "You won! Guess again?"}
            {lastResult === "loss" && (
              <>
                <span aria-hidden>😢 </span>You lost. Guess again?
              </>
            )}
            {lastResult === "tie" && "Tie. No change. Guess again?"}
          </p>
          {lastResolution != null && (
            <p className="text-sm text-muted-foreground">
              You guessed ${lastResolution.priceAtGuess.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, actual
              price was ${lastResolution.priceAtResolution.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          )}
        </div>
      )}
      {pendingGuess != null && nextCheckInSeconds !== null && (
        <p className="text-sm text-muted-foreground">
          Next check in {nextCheckInSeconds}s
        </p>
      )}
      {pendingGuess != null && nextCheckInSeconds === null && (
        <p className="text-sm text-muted-foreground">
          Checking for result
        </p>
      )}
      <GuessButtons
        hasPendingGuess={pendingGuess != null}
        selectedDirection={
          pendingGuess?.direction === "up" || pendingGuess?.direction === "down"
            ? pendingGuess.direction
            : null
        }
        onGuess={handleGuess}
        currentPrice={price}
        loading={guessLoading}
      />
    </div>
  );
}
