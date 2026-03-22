"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export type PricePoint = {
  timestamp: number;
  price: number;
};

type PriceChartProps = {
  data: PricePoint[];
  priceAtGuess?: number | null;
};

function formatPriceAxis(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}k`;
  }
  return value.toFixed(2);
}

export function PriceChart({ data, priceAtGuess = null }: PriceChartProps) {
  const locale = useLocale();
  const t = useTranslations("PriceChart");
  const chartHeight = 300;

  const formatRelative = (msAgo: number) => {
    if (msAgo <= 0) return t("now");
    const sec = Math.floor(msAgo / 1000);
    return t("minusSeconds", { sec: String(sec) });
  };

  if (data.length === 0) {
    return (
      <section
        className="w-full min-h-[300px] rounded-md border border-border bg-muted/30 flex items-center justify-center"
        aria-label={t("chartRegionLabel")}
      >
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      </section>
    );
  }

  const latestTimestamp = data[data.length - 1]?.timestamp ?? 0;
  const twoMinutesMs = 2 * 60 * 1000;
  const domainStart = latestTimestamp - twoMinutesMs;

  const prices = data.map((d) => d.price);
  const dataMin = Math.min(...prices);
  const dataMax = Math.max(...prices);
  const yMin =
    priceAtGuess != null ? Math.min(dataMin, priceAtGuess) : dataMin;
  const yMax =
    priceAtGuess != null ? Math.max(dataMax, priceAtGuess) : dataMax;
  const yPadding = Math.max((yMax - yMin) * 0.01, 10);
  const yDomain = [yMin - yPadding, yMax + yPadding] as [number, number];

  const twentySecondsMs = 20_000;
  const ticks: number[] = [];
  for (let t0 = domainStart; t0 <= latestTimestamp; t0 += twentySecondsMs) {
    ticks.push(t0);
  }
  if (ticks.length === 0 || ticks[ticks.length - 1] !== latestTimestamp) {
    ticks.push(latestTimestamp);
  }

  const formatTooltipPrice = (value: unknown) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));

  const guessPriceFormatted =
    priceAtGuess != null
      ? new Intl.NumberFormat(locale, {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(priceAtGuess)
      : "";

  const latestPrice = data[data.length - 1]?.price ?? 0;
  const summaryLatest = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(latestPrice);
  const summaryLow = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dataMin);
  const summaryHigh = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dataMax);

  const tableRows = data.slice(-5);

  return (
    <section
      className="w-full min-h-[300px] rounded-md border border-border bg-muted/30 p-2"
      aria-label={t("chartRegionLabel")}
    >
      <div aria-hidden="true">
        <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            type="number"
            dataKey="timestamp"
            domain={[domainStart, latestTimestamp]}
            ticks={ticks}
            tickFormatter={(ts: number) => formatRelative(latestTimestamp - ts)}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            stroke="var(--border)"
          />
          <YAxis
            type="number"
            dataKey="price"
            tickFormatter={formatPriceAxis}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            stroke="var(--border)"
            domain={yDomain}
            width={50}
            tickCount={5}
          />
          <Tooltip
            formatter={(value: unknown) => [
              formatTooltipPrice(value),
              t("tooltipPrice"),
            ]}
            labelFormatter={(label: unknown) =>
              formatRelative(latestTimestamp - Number(label))
            }
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="var(--chart-btc)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          {priceAtGuess != null && (
            <ReferenceLine
              y={priceAtGuess}
              stroke="var(--primary)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: t("guessLabel"),
                position: "right",
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      </div>
      <div className="sr-only">
        <p>
          {t("a11ySummary", {
            latest: summaryLatest,
            low: summaryLow,
            high: summaryHigh,
            count: String(data.length),
          })}
        </p>
        <table>
          <caption>{t("tableCaption")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("colTime")}</th>
              <th scope="col">{t("colPrice")}</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.timestamp}>
                <td>{formatRelative(latestTimestamp - row.timestamp)}</td>
                <td>
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(row.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {priceAtGuess != null && (
          <p>{t("a11yGuessLine", { price: guessPriceFormatted })}</p>
        )}
      </div>
      {priceAtGuess != null && (
        <p
          className="text-xs text-muted-foreground mt-1 text-center"
          aria-hidden="true"
        >
          {t("guessPriceLine", { price: guessPriceFormatted })}
        </p>
      )}
    </section>
  );
}
