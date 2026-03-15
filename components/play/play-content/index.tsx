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
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8">
      <div className="min-w-0 w-full flex-1 px-4 py-4 sm:px-6 sm:py-6 xl:min-w-[28rem]">
        <GameContainer
          userDisplayName={userDisplayName}
          initialScore={initialScore}
          initialPendingGuess={initialPendingGuess}
          onResolution={onResolution}
        />
      </div>
      <div className="w-full shrink-0 border-t border-border/60 px-4 py-4 xl:w-64 xl:border-t-0 xl:border-l xl:border-border/60 xl:pl-8 xl:pr-4">
        <PlayTabs currentUserId={currentUserId} refetchTrigger={refetchTrigger} />
      </div>
    </div>
  );
}
