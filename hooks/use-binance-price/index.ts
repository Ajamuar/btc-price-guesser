"use client";

import { useEffect, useRef, useState } from "react";
import { getWebSocketConstructor } from "@/lib/browser-websocket";

const WS_URL = "wss://stream.binance.com:9443/ws/btcusdt@trade";
const CHART_INTERVAL_MS = 1000;
const WINDOW_MS = 2 * 60 * 1000; // 2 minutes

type PricePoint = { timestamp: number; price: number };

type BinanceTradeEvent = {
  e: string;
  E: number;
  s: string;
  p: string;
  q: string;
  T: number;
};

export type BinancePriceError = "connection" | "closed";

export function useBinancePrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<BinancePriceError | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const lastChartTimeRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const WebSocketCtor = getWebSocketConstructor();

    function connect() {
      if (wsRef.current?.readyState === WebSocketCtor.OPEN) return;

      setError(null);
      const ws = new WebSocketCtor(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (wsRef.current !== ws) return;
        setError(null);
        setLoading(false);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        if (wsRef.current !== ws) return;
        try {
          const data = JSON.parse(event.data as string) as BinanceTradeEvent;
          if (data.e !== "trade" || !data.p) return;

          const priceNum = parseFloat(data.p);
          const eventTime = data.E;

          setPrice(priceNum);

          const now = Date.now();
          if (eventTime - lastChartTimeRef.current >= CHART_INTERVAL_MS) {
            lastChartTimeRef.current = eventTime;
            setPriceHistory((prev) => {
              const next = [...prev, { timestamp: eventTime, price: priceNum }];
              const cutoff = now - WINDOW_MS;
              return next.filter((p) => p.timestamp >= cutoff);
            });
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        if (wsRef.current !== ws) return;
        wsRef.current = null;
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, 3000);
        } else {
          setError("closed");
        }
      };

      ws.onerror = () => {
        if (wsRef.current !== ws) return;
        setError("connection");
      };
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return { price, priceHistory, loading, error };
}
