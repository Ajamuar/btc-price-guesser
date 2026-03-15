"use client";

type LivePriceProps = {
  price: number | null;
  loading?: boolean;
  error?: string | null;
};

export function LivePrice({ price, loading = false, error = null }: LivePriceProps) {
  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error}
      </p>
    );
  }
  if (loading) {
    return (
      <p className="text-base font-medium text-muted-foreground sm:text-lg">
        —
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
  return (
    <p className="text-base font-medium text-foreground sm:text-lg">
      BTC: ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  );
}
