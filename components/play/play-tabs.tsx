"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LeaderboardTab } from "@/components/play/leaderboard-tab";
import { HistoryTab } from "@/components/play/history-tab";

type PlayTabsProps = {
  currentUserId?: string | null;
  refetchTrigger?: number;
};

export function PlayTabs({ currentUserId, refetchTrigger }: PlayTabsProps) {
  const [value, setValue] = useState("leaderboard");

  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      <TabsContent value="leaderboard" className="min-h-[200px]">
        <LeaderboardTab currentUserId={currentUserId} refetchTrigger={refetchTrigger} />
      </TabsContent>
      <TabsContent value="history" className="min-h-[200px]">
        <HistoryTab refetchTrigger={refetchTrigger} />
      </TabsContent>
    </Tabs>
  );
}
