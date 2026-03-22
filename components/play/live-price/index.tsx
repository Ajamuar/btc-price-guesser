"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const ANNOUNCE_DEBOUNCE_MS = 2000;

type LivePriceProps = {
  price: number | null;
  loading?: boolean;
  error?: string | null;
};

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

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

  const debouncedFormatted = useDebounced(formatted, ANNOUNCE_DEBOUNCE_MS);

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
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
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
        className="text-base font-medium text-foreground sm:text-lg"
        aria-hidden="true"
      >
        {t("btcPrice", { price: formatted })}
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {t("btcPrice", { price: debouncedFormatted })}
      </p>
    </>
  );
}
