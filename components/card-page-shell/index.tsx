import type { Session } from "next-auth";
import { MainRegion } from "@/components/main-region";
import { SiteHeader } from "@/components/site-header";
import { MainContentCard } from "@/components/main-content-card";
import {
  PageContainer,
  type PageContainerVariant,
} from "@/components/page-container";
import { cn } from "@/lib/utils";

export const CARD_PAGE_SHELL_OUTER_CLASS =
  "flex min-h-screen w-full flex-col bg-page-canvas";

export const CARD_PAGE_SHELL_MAIN_CLASS =
  "flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20";

export const CARD_PAGE_INNER_STACK_CLASS = "flex flex-col items-center gap-6";

export const CARD_PAGE_INNER_STACK_TEXT_CLASS =
  "flex flex-col items-center gap-6 text-center";

type CardPageShellProps = {
  session: Session | null;
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
};

export function CardPageShell({
  session,
  children,
  className,
  mainClassName,
}: CardPageShellProps) {
  return (
    <div className={cn(CARD_PAGE_SHELL_OUTER_CLASS, className)}>
      <SiteHeader session={session} />
      <MainRegion className={cn(CARD_PAGE_SHELL_MAIN_CLASS, mainClassName)}>
        {children}
      </MainRegion>
    </div>
  );
}

type CardPageFrameProps = {
  children: React.ReactNode;
  variant?: PageContainerVariant;
  innerClassName?: string;
};

export function CardPageFrame({
  children,
  variant = "narrow",
  innerClassName,
}: CardPageFrameProps) {
  return (
    <PageContainer variant={variant}>
      <MainContentCard>
        {innerClassName ? (
          <div className={innerClassName}>{children}</div>
        ) : (
          children
        )}
      </MainContentCard>
    </PageContainer>
  );
}
