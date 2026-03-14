"use client";

import { Button } from "@/components/ui/button";

export function GuessButtonsPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <Button size="lg" disabled variant="outline">
          Up
        </Button>
        <Button size="lg" disabled variant="outline">
          Down
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Guess in Phase 4</p>
    </div>
  );
}
