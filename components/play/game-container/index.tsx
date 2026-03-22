"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
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
  const tLivePrice = useTranslations("LivePrice");
  const tToast = useTranslations("Toast");
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
    guessError,
    mePollError,
  } = useGamePlay({ initialScore, initialPendingGuess });

  const prevLastResultRef = useRef<typeof lastResult>(null);
  const prevPriceErrorRef = useRef<typeof error>(null);
  const prevGuessErrorRef = useRef<typeof guessError>(null);
  const prevMePollErrorRef = useRef<typeof mePollError>(null);

  useEffect(() => {
    if (lastResult != null && prevLastResultRef.current === null) {
      onResolution?.();
    }
    prevLastResultRef.current = lastResult;
  }, [lastResult, onResolution]);

  useEffect(() => {
    if (
      error != null &&
      (prevPriceErrorRef.current === null || prevPriceErrorRef.current !== error)
    ) {
      const message =
        error === "closed"
          ? tLivePrice("errorClosed")
          : tLivePrice("errorConnection");
      toast.error(message);
    }
    prevPriceErrorRef.current = error;
  }, [error, tLivePrice]);

  useEffect(() => {
    if (
      guessError != null &&
      (prevGuessErrorRef.current === null ||
        prevGuessErrorRef.current !== guessError)
    ) {
      const message =
        guessError === "server"
          ? tToast("guessServer")
          : tToast("guessNetwork");
      toast.error(message);
    }
    prevGuessErrorRef.current = guessError;
  }, [guessError, tToast]);

  useEffect(() => {
    if (
      mePollError === "stopped" &&
      prevMePollErrorRef.current !== "stopped"
    ) {
      toast.error(tToast("mePollStopped"));
    }
    prevMePollErrorRef.current = mePollError;
  }, [mePollError, tToast]);

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
      {pendingGuess != null && mePollError === "stopped" && (
        <p className="text-sm text-destructive" role="alert">
          {tToast("mePollStopped")}
        </p>
      )}
      {pendingGuess != null &&
        mePollError !== "stopped" &&
        nextCheckInSeconds !== null && (
          <p className="text-sm text-muted-foreground">
            {t("nextCheck", { seconds: String(nextCheckInSeconds) })}
          </p>
        )}
      {pendingGuess != null &&
        mePollError !== "stopped" &&
        nextCheckInSeconds === null && (
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
