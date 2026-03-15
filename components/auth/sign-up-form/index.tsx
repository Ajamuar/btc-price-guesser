"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const buttonClass =
  "w-full min-h-12 text-sm sm:w-auto sm:min-h-11 sm:text-base bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-offset-teal-950";

type SignUpFormProps = {
  callbackUrl?: string;
};

export function SignUpForm({ callbackUrl = "/" }: SignUpFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const nameRaw = (form.elements.namedItem("name") as HTMLInputElement).value;
    const name = nameRaw.trim() || null;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        const signInUrl = `/auth/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
        router.push(signInUrl);
        return;
      }

      if (res.status === 409) {
        setError(data.error ?? "Email already registered");
        return;
      }
      if (res.status === 400) {
        setError(data.error ?? "Invalid input");
        return;
      }
      setError(data.error ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-4 sm:w-auto"
      >
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <div className="flex w-full min-w-[240px] flex-col gap-2 sm:w-80">
          <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputClass}
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>
        <div className="flex w-full min-w-[240px] flex-col gap-2 sm:w-80">
          <label htmlFor="signup-password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputClass}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">At least 8 characters</p>
        </div>
        <div className="flex w-full min-w-[240px] flex-col gap-2 sm:w-80">
          <label htmlFor="signup-name" className="text-sm font-medium text-foreground">
            Name <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            placeholder="Your name"
            disabled={loading}
          />
        </div>
        <Button type="submit" size="lg" className={buttonClass} disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={`/auth/signin${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="font-medium text-teal-600 underline-offset-4 hover:underline dark:text-teal-400"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
