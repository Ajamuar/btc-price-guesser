import { cn } from "@/lib/utils";

/** Max width for the card column; `wide` matches the play dashboard. */
const variantClass = {
  narrow:
    "w-full max-w-full px-0 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8",
  wide: "w-full max-w-full px-0 sm:max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8 xl:max-w-[88rem] 2xl:max-w-[96rem]",
} as const;

export type PageContainerVariant = keyof typeof variantClass;

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  variant?: PageContainerVariant;
};

export function PageContainer({
  children,
  className,
  variant = "narrow",
}: PageContainerProps) {
  return (
    <div className={cn(variantClass[variant], className)}>{children}</div>
  );
}
