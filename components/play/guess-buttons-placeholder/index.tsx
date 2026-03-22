"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function GuessButtonsPlaceholder() {
  const t = useTranslations("GuessButtonsPlaceholder");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        <Button size="lg" disabled variant="outline">
          {t("up")}
        </Button>
        <Button size="lg" disabled variant="outline">
          {t("down")}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">{t("hint")}</p>
    </div>
  );
}
