"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link as IntlLink } from "@/i18n/navigation";
import { hrefForLocale } from "@/i18n/paths";
import { getCsrfToken } from "next-auth/react";
import { Button } from "@/components/ui/button";

const signOutButtonClass =
  "w-full min-h-12 text-sm sm:w-auto sm:min-h-11 sm:text-base bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-card";

export function SignOutActions() {
  const locale = useLocale();
  const t = useTranslations("SignOutActions");
  const homeHref = hrefForLocale(locale, "/");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    getCsrfToken().then((token) => setCsrfToken(token ?? null));
  }, []);

  if (!csrfToken) {
    return (
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" className={signOutButtonClass} disabled>
          {t("signOut")}
        </Button>
        <Button asChild size="lg" variant="outline" className="min-h-12 text-sm sm:min-h-11 sm:text-base">
          <IntlLink href="/">{t("cancel")}</IntlLink>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row">
      <form action="/api/auth/signout" method="post" className="contents">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <input type="hidden" name="callbackUrl" value={homeHref} />
        <Button type="submit" size="lg" className={signOutButtonClass}>
          {t("signOut")}
        </Button>
      </form>
      <Button
        asChild
        size="lg"
        variant="outline"
        className="min-h-12 text-sm sm:min-h-11 sm:text-base"
      >
        <IntlLink href="/">{t("cancel")}</IntlLink>
      </Button>
    </div>
  );
}
