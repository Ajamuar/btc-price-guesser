"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export type PricePoint = {
  timestamp: number;
  price: number;
};

type PriceChartProps = {
  data: PricePoint[];
  priceAtGuess?: number | null;
};

/** Format ms ago as -10s, -60s, -120s (always seconds); 0 → "now" */
function formatRelative(msAgo: number): string {
  if (msAgo <= 0) return "now";
  const sec = Math.floor(msAgo / 1000);
  return `-${sec}s`;
}

function formatPrice(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toFixed(2);
}

export function PriceChart({ data, priceAtGuess = null }: PriceChartProps) {
  if (data.length === 0) {
    return (
      <div className="w-full min-h-[200px] rounded-md border border-border bg-muted/30 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Connecting… price chart will appear when data is available.
        </p>
      </div>
    );
  }

  const latestTimestamp = data[data.length - 1]?.timestamp ?? 0;
  const twoMinutesMs = 2 * 60 * 1000;
  const domainStart = latestTimestamp - twoMinutesMs;

  return (
    <div className="w-full min-h-[200px] rounded-md border border-border bg-muted/30 p-2">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <XAxis
            dataKey="timestamp"
            domain={[domainStart, latestTimestamp]}
            tickFormatter={(ts: number) => formatRelative(latestTimestamp - ts)}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            stroke="var(--border)"
          />
          <YAxis
            dataKey="price"
            tickFormatter={formatPrice}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            stroke="var(--border)"
            domain={["auto", "auto"]}
            width={50}
          />
          <Tooltip
            formatter={(value: unknown) => [
              `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              "Price",
            ]}
            labelFormatter={(label: unknown) => formatRelative(latestTimestamp - Number(label))}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#0d9488"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      {priceAtGuess != null && (
        <p className="text-xs text-muted-foreground mt-1 text-center">
          Variance from guess (${priceAtGuess.toLocaleString()}) in Phase 3 Step 7
        </p>
      )}
    </div>
  );
}
