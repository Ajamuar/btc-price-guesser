"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
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
  const locale = useLocale();
  const t = useTranslations("Game");
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

  const formatMoney = (n: number) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);

  const displayName = userDisplayName ?? t("anonymous");

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
        {t("greeting", { name: displayName })}
      </h1>
      <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
        <p className="text-sm font-medium text-foreground sm:text-base">
          {t("score", { score: String(score) })}
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
          <p className="text-sm font-medium text-foreground sm:text-base">
            {lastResult === "win" && t("resultWin")}
            {lastResult === "loss" && (
              <>
                <span aria-hidden>😢 </span>
                {t("resultLoss")}
              </>
            )}
            {lastResult === "tie" && t("resultTie")}
          </p>
          {lastResolution != null && (
            <p className="text-sm text-muted-foreground">
              {t("resolutionDetail", {
                guessed: formatMoney(lastResolution.priceAtGuess),
                actual: formatMoney(lastResolution.priceAtResolution),
              })}
            </p>
          )}
        </div>
      )}
      {pendingGuess != null && nextCheckInSeconds !== null && (
        <p className="text-sm text-muted-foreground">
          {t("nextCheck", { seconds: String(nextCheckInSeconds) })}
        </p>
      )}
      {pendingGuess != null && nextCheckInSeconds === null && (
        <p className="text-sm text-muted-foreground">{t("checkingResult")}</p>
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
