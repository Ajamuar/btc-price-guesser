"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type MainRegionProps = {
  children: React.ReactNode;
  className?: string;
};

export function MainRegion({ children, className }: MainRegionProps) {
  const t = useTranslations("SkipLink");
  return (
    <main
      id="main-content"
      tabIndex={-1}
      aria-label={t("mainLandmark")}
      className={cn(
        className,
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      {children}
    </main>
  );
}
