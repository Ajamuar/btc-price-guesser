import type { Session } from "next-auth";
import Link from "next/link";

const APP_NAME = "BTC Price Guesser";

type SiteHeaderProps = {
  session: Session | null;
};

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-teal-200/50 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:px-6 sm:py-4 lg:px-8 dark:border-teal-900/30 dark:bg-teal-950/95">
      <Link
        href="/"
        className="text-lg font-semibold text-foreground hover:text-foreground/90"
      >
        {APP_NAME}
      </Link>
      <nav>
        {session ? (
          <Link
            href="/api/auth/signout?callbackUrl=/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign out
          </Link>
        ) : (
          <Link
            href="/api/auth/signin?callbackUrl=/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
