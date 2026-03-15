import { cn } from "@/lib/utils";

type MainContentCardProps = {
  children: React.ReactNode;
  className?: string;
};

const cardClasses =
  "w-full rounded-xl border border-teal-200/60 bg-white px-8 py-10 shadow-lg sm:px-12 sm:py-16 dark:border-teal-800/50 dark:bg-card";

export function MainContentCard({ children, className }: MainContentCardProps) {
  return <div className={cn(cardClasses, className)}>{children}</div>;
}
