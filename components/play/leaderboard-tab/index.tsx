"use client";

import { useTranslations } from "next-intl";
import { useLeaderboard } from "@/hooks/use-leaderboard";

type LeaderboardTabProps = {
  currentUserId?: string | null;
  refetchTrigger?: number;
};

export function LeaderboardTab({ currentUserId, refetchTrigger }: LeaderboardTabProps) {
  const t = useTranslations("Leaderboard");
  const { entries, loading, error } = useLeaderboard(50, refetchTrigger);

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
  if (!entries.length) {
    return (
      <p className="py-4 text-sm text-muted-foreground">{t("empty")}</p>
    );
  }

  return (
    <ul className="flex flex-col gap-1 py-2">
      {entries.map((entry) => {
        const isYou = currentUserId != null && entry.userId === currentUserId;
        return (
          <li
            key={entry.userId}
            className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm ${
              isYou ? "bg-teal-100 font-medium dark:bg-teal-900/50" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-6 text-right tabular-nums text-muted-foreground">
                {entry.rank}.
              </span>
              <span>{entry.name || entry.userId || "—"}</span>
              {isYou && (
                <span className="text-xs text-muted-foreground">{t("you")}</span>
              )}
            </span>
            <span className="tabular-nums font-medium">{entry.score}</span>
          </li>
        );
      })}
    </ul>
  );
}
