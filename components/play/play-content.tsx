"use client";

import { useState, useCallback } from "react";
import { GameContainer } from "@/components/play/game-container";
import { PlayTabs } from "@/components/play/play-tabs";
import type { PendingGuess } from "@/hooks/use-game-play";

type PlayContentProps = {
  userDisplayName?: string | null;
  initialScore: number;
  initialPendingGuess: PendingGuess;
  currentUserId?: string | null;
};

export function PlayContent({
  userDisplayName,
  initialScore,
  initialPendingGuess,
  currentUserId,
}: PlayContentProps) {
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const onResolution = useCallback(() => {
    setRefetchTrigger((c) => c + 1);
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="w-full flex-1 rounded-xl border border-teal-200/60 bg-white px-8 py-10 shadow-lg sm:px-12 sm:py-14 dark:border-teal-800/50 dark:bg-card">
        <GameContainer
          userDisplayName={userDisplayName}
          initialScore={initialScore}
          initialPendingGuess={initialPendingGuess}
          onResolution={onResolution}
        />
      </div>
      <div className="w-full shrink-0 rounded-xl border border-teal-200/60 bg-white px-4 py-4 shadow-lg dark:border-teal-800/50 dark:bg-card lg:w-80">
        <PlayTabs currentUserId={currentUserId} refetchTrigger={refetchTrigger} />
      </div>
    </div>
  );
}
