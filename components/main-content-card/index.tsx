import { cn } from "@/lib/utils";

type MainContentCardProps = {
  children: React.ReactNode;
  className?: string;
};

const cardClasses =
  "w-full min-h-0 min-w-80 flex-1 flex flex-col rounded-none border-0 shadow-none bg-card px-4 py-6 text-card-foreground md:flex-initial md:rounded-xl md:border md:border-border md:shadow-lg md:px-12 md:py-16";

export function MainContentCard({ children, className }: MainContentCardProps) {
  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className={cn(cardClasses, className)}>{children}</div>
    </div>
  );
}
