import type { Session } from "next-auth";
import Link from "next/link";

const APP_NAME = "BTC Price Guesser";

type SiteHeaderProps = {
  session: Session | null;
};

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background px-3 py-4 shadow-md md:px-6 md:py-4 lg:px-8">
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
            className="rounded-md text-xs font-medium text-foreground/90 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm"
          >
            Sign out
          </Link>
        ) : (
          <Link
            href="/api/auth/signin?callbackUrl=/"
            className="rounded-md text-xs font-medium text-foreground/90 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
