import type { Session } from "next-auth";
import Link from "next/link";

const APP_NAME = "BTC Price Guesser";

type SiteHeaderProps = {
  session: Session | null;
};

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between border-b border-teal-200/50 bg-white/95 px-3 py-4 shadow-sm backdrop-blur md:px-6 md:py-4 lg:px-8 dark:border-teal-900/30 dark:bg-teal-950/95">
      <Link
        href="/"
        className="text-base font-semibold text-foreground hover:text-foreground/90 sm:text-lg"
      >
        {APP_NAME}
      </Link>
      <nav>
        {session ? (
          <Link
            href="/auth/signout"
            className="rounded-md text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-sm dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950"
          >
            Sign out
          </Link>
        ) : (
          <Link
            href="/api/auth/signin?callbackUrl=/"
            className="rounded-md text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-sm dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
