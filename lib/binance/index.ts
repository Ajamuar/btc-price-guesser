/**
 * Uses historical klines so resolution uses price at the correct moment (e.g. 60s after guess).
 * When BINANCE_KLINES_PROXY_URL is set, calls the Lambda proxy instead of Binance (for Vercel where Binance blocks cloud IPs).
 */

const BINANCE_KLINES_URL = "https://api.binance.com/api/v3/klines";
const SYMBOL = "BTCUSDT";

/** Kline interval: 1s for exact-second resolution (price at 60s). */
const INTERVAL = "1s";

function parseKlinesResponse(data: unknown): number | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const kline = data[0] as unknown;
  if (!Array.isArray(kline) || kline.length < 5) return null;
  const closeStr = kline[4] as string;
  const price = parseFloat(closeStr);
  return Number.isFinite(price) ? price : null;
}

/**
 * Fetch historical BTCUSDT price at a given timestamp (ms).
 * Uses 1s klines: returns the close price of the 1s candle that contains timestampMs.
 * Returns null if the API fails or the candle is unavailable (e.g. too recent).
 * When BINANCE_KLINES_PROXY_URL is set, requests go to the proxy (e.g. Lambda) instead of Binance.
 */
export async function getBinancePriceAtTime(
  timestampMs: number
): Promise<number | null> {
  const proxyUrl = process.env.BINANCE_KLINES_PROXY_URL;

  if (proxyUrl) {
    try {
      const url = `${proxyUrl}${proxyUrl.includes("?") ? "&" : "?"}timestampMs=${timestampMs}`;
      const headers: HeadersInit = {};
      const apiKey = process.env.BINANCE_PROXY_API_KEY;
      if (apiKey) headers["x-api-key"] = apiKey;

      const res = await fetch(url, { headers });
      const data = (await res.json()) as unknown;
      const price = res.ok ? parseKlinesResponse(data) : null;
      console.log("[binance] proxy", {
        status: res.status,
        ok: res.ok,
        hasArray: Array.isArray(data),
        arrayLength: Array.isArray(data) ? data.length : 0,
        price: price ?? "null",
      });
      if (!res.ok) return null;
      return price;
    } catch (err) {
      console.log("[binance] proxy error", { err: String(err) });
      return null;
    }
  }

  const openTime = Math.floor(timestampMs / 1000) * 1000;
  const params = new URLSearchParams({
    symbol: SYMBOL,
    interval: INTERVAL,
    startTime: String(openTime),
    limit: "1",
  });

  try {
    const res = await fetch(`${BINANCE_KLINES_URL}?${params.toString()}`);
    const data = (await res.json()) as unknown;
    const price = res.ok ? parseKlinesResponse(data) : null;
    console.log("[binance] direct", {
      status: res.status,
      ok: res.ok,
      hasArray: Array.isArray(data),
      arrayLength: Array.isArray(data) ? data.length : 0,
      price: price ?? "null",
    });
    if (!res.ok) return null;
    return price;
  } catch (err) {
    console.log("[binance] direct error", { err: String(err) });
    return null;
  }
}
