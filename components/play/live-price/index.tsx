"use client";

import { useLocale, useTranslations } from "next-intl";

type LivePriceProps = {
  price: number | null;
  loading?: boolean;
  error?: string | null;
};

export function LivePrice({ price, loading = false, error = null }: LivePriceProps) {
  const locale = useLocale();
  const t = useTranslations("LivePrice");

  if (loading) {
    return (
      <p className="text-base font-medium text-muted-foreground sm:text-lg">
        {t("connecting")}
      </p>
    );
  }
  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error}
      </p>
    );
  }
  if (price === null) {
    return (
      <p className="text-base font-medium text-muted-foreground sm:text-lg">
        —
      </p>
    );
  }
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return (
    <p className="text-base font-medium text-foreground sm:text-lg">
      {t("btcPrice", { price: formatted })}
    </p>
  );
}
