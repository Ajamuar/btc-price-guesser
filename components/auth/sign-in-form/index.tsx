"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import type { ClientSafeProvider } from "next-auth/react";
import { Button } from "@/components/ui/button";

const buttonClass =
  "w-full min-h-12 sm:w-auto sm:min-h-11 bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-offset-teal-950";

type SignInFormProps = {
  callbackUrl?: string;
};

export function SignInForm({ callbackUrl = "/" }: SignInFormProps) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    Promise.all([getCsrfToken(), getProviders()]).then(([token, prov]) => {
      setCsrfToken(token ?? null);
      setProviders(prov ?? null);
    });
  }, []);

  if (csrfToken === null || providers === null) {
    return (
      <div className="flex justify-center py-8 text-muted-foreground">Loading…</div>
    );
  }

  const hasGoogle = "google" in providers;
  const hasCredentials = "credentials" in providers;

  return (
    <div className="flex flex-col items-center gap-6">
      {hasGoogle && (
        <>
          <Button
            type="button"
            size="lg"
            className={buttonClass}
            onClick={() => signIn("google", { callbackUrl })}
          >
            Sign in with Google
          </Button>
          {hasCredentials && (
            <div className="flex w-full items-center gap-3 text-sm text-muted-foreground">
              <span className="flex-1 border-t border-border" />
              or
              <span className="flex-1 border-t border-border" />
            </div>
          )}
        </>
      )}

      {hasCredentials && (
        <form
          method="post"
          action="/api/auth/callback/credentials"
          className="flex w-full flex-col items-center gap-4 sm:w-auto"
        >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <input name="callbackUrl" type="hidden" defaultValue={callbackUrl} />
          <div className="flex w-full min-w-[240px] flex-col gap-2 sm:w-80">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex w-full min-w-[240px] flex-col gap-2 sm:w-80">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </div>
          <Button type="submit" size="lg" className={buttonClass}>
            Sign in
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/signup${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-teal-600 underline-offset-4 hover:underline dark:text-teal-400"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
