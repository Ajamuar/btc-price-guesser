"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { BinancePriceError } from "@/hooks/use-binance-price";

const ANNOUNCE_INTERVAL_MS = 5000;

type LivePriceProps = {
  price: number | null;
  loading?: boolean;
  error?: BinancePriceError | null;
};

export function LivePrice({ price, loading = false, error = null }: LivePriceProps) {
  const locale = useLocale();
  const t = useTranslations("LivePrice");

  const formatted =
    price === null
      ? ""
      : new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price);

  const [liveText, setLiveText] = useState("");
  const shouldAnnounce = !loading && !error && price !== null && Boolean(formatted);
  const latestFormattedRef = useRef(formatted);

  useEffect(() => {
    latestFormattedRef.current = formatted;
  }, [formatted]);

  useEffect(() => {
    if (!shouldAnnounce) {
      setLiveText("");
      return;
    }

    let isActive = true;
    let announceTick = 0;

    const queueAnnouncement = () => {
      if (!isActive) return;
      const latestFormatted = latestFormattedRef.current;
      if (!latestFormatted) return;
      announceTick += 1;
      // Zero-width suffix forces DOM text change so same prices are re-announced.
      const nonce = announceTick % 2 === 0 ? "\u200B" : "\u200C";
      setLiveText(`${t("btcPrice", { price: latestFormatted })}${nonce}`);
    };

    queueAnnouncement();
    const intervalId = setInterval(queueAnnouncement, ANNOUNCE_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [shouldAnnounce, t]);

  if (loading) {
    return (
      <p
        className="text-base font-medium text-muted-foreground sm:text-lg"
        aria-live="polite"
        aria-busy="true"
      >
        {t("connecting")}
      </p>
    );
  }
  if (error) {
    const errorMessage =
      error === "closed" ? t("errorClosed") : t("errorConnection");
    return (
      <p className="text-sm text-destructive" role="alert">
        {errorMessage}
      </p>
    );
  }
  if (price === null) {
    return (
      <p className="text-base font-medium text-muted-foreground sm:text-lg" aria-live="polite">
        —
      </p>
    );
  }

  return (
    <>
      <p
        className="text-base font-medium text-foreground sm:text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        tabIndex={0}
        onMouseDown={(event) => event.preventDefault()}
        aria-label={t("btcPrice", { price: formatted })}
      >
        {t("btcPrice", { price: formatted })}
      </p>
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {liveText}
      </p>
    </>
  );
}
