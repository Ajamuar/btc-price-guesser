"use client";

import { useState, useEffect } from "react";
import type { GuessHistoryItem } from "@/lib/history";

const DEFAULT_LIMIT = 50;

export function useHistory(
  limit: number = DEFAULT_LIMIT,
  refetchTrigger?: number
) {
  const [history, setHistory] = useState<GuessHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/me/history?limit=${limit}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) throw new Error("Failed to load history");
        return res.json();
      })
      .then((data: { history: GuessHistoryItem[] }) => {
        if (!cancelled) setHistory(data.history ?? []);
      })
      .catch((e) => {
        if (!cancelled && e.name !== "AbortError")
          setError(e instanceof Error ? e.message : "Error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [limit, refetchTrigger]);

  return { history, loading, error };
}
