"use client";

import { useLocale, useTranslations } from "next-intl";
import { useHistory } from "@/hooks/use-history";

type HistoryTabProps = {
  refetchTrigger?: number;
};

export function HistoryTab({ refetchTrigger }: HistoryTabProps) {
  const locale = useLocale();
  const t = useTranslations("History");
  const { history, loading, error } = useHistory(50, refetchTrigger);

  function formatTime(timestamp: number): string {
    try {
      return new Intl.DateTimeFormat(locale, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(timestamp));
    } catch {
      return "";
    }
  }

  function formatPrice(n: number): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  }

  function directionLabel(direction: string): string {
    return direction === "up" ? t("directionUp") : t("directionDown");
  }

  function resultLabel(result: string): string {
    if (result === "win") return t("resultWin");
    if (result === "loss") return t("resultLoss");
    return t("resultTie");
  }

  if (loading) {
    return (
      <p className="py-4 text-sm text-muted-foreground">{t("loading")}</p>
    );
  }
  if (error) {
    return (
      <p className="py-4 text-sm text-destructive">{error}</p>
    );
  }
  if (!history.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center">
        <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t("emptyHint")}</p>
      </div>
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
            <span className="font-medium capitalize">{directionLabel(item.direction)}</span>
            <span
              className={
                item.result === "win"
                  ? "text-green-600 dark:text-green-400"
                  : item.result === "loss"
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
              }
            >
              {resultLabel(item.result)}
            </span>
          </div>
          <p className="mt-0.5 text-muted-foreground">
            {t("priceArrow", {
              from: `$${formatPrice(item.priceAtGuess)}`,
              to: `$${formatPrice(item.priceAtResolution)}`,
            })}
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {t("scoreAfter", { score: String(item.scoreAfter) })}
          </p>
          <p className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</p>
        </li>
      ))}
    </ul>
  );
}
