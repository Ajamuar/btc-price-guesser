"use client";

import { useState, useEffect } from "react";
import type { LeaderboardEntry } from "@/lib/leaderboard";

const DEFAULT_LIMIT = 50;

export function useLeaderboard(
  limit: number = DEFAULT_LIMIT,
  refetchTrigger?: number
) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/leaderboard?limit=${limit}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load leaderboard");
        return res.json();
      })
      .then((data: { entries: LeaderboardEntry[] }) => {
        if (!cancelled) setEntries(data.entries ?? []);
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

  return { entries, loading, error };
}
