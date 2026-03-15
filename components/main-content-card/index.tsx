import { cn } from "@/lib/utils";

type MainContentCardProps = {
  children: React.ReactNode;
  className?: string;
};

const cardClasses =
  "w-full min-h-0 flex-1 flex flex-col rounded-none border-0 shadow-none bg-white px-4 py-6 dark:bg-card md:flex-initial md:rounded-xl md:border md:border-teal-200/60 md:shadow-lg md:px-12 md:py-16 md:dark:border-teal-800/50";

export function MainContentCard({ children, className }: MainContentCardProps) {
  return <div className={cn(cardClasses, className)}>{children}</div>;
}
