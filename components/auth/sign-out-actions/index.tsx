"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCsrfToken } from "next-auth/react";
import { Button } from "@/components/ui/button";

const signOutButtonClass =
  "w-full min-h-12 text-sm sm:w-auto sm:min-h-11 sm:text-base bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950";

export function SignOutActions() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? null));
  }, []);

  if (!csrfToken) {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" className={signOutButtonClass} disabled>
          Sign out
        </Button>
        <Button asChild size="lg" variant="outline" className="min-h-12 text-sm sm:min-h-11 sm:text-base">
          <Link href="/">Cancel</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <form action="/api/auth/signout" method="post" className="contents">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="callbackUrl" value="/" />
        <Button type="submit" size="lg" className={signOutButtonClass}>
          Sign out
        </Button>
      </form>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="min-h-12 text-sm sm:min-h-11 sm:text-base"
      >
        <Link href="/">Cancel</Link>
      </Button>
    </div>
  );
}
