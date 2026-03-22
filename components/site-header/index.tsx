import type { Session } from "next-auth";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Link as IntlLink } from "@/i18n/navigation";
import { hrefForLocale } from "@/i18n/paths";

type SiteHeaderProps = {
  session: Session | null;
};

export async function SiteHeader({ session }: SiteHeaderProps) {
  const locale = await getLocale();
  const t = await getTranslations("SiteHeader");
  const homeHref = hrefForLocale(locale, "/");
  const signInCallback = encodeURIComponent(homeHref);

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background px-3 py-4 shadow-md md:px-6 md:py-4 lg:px-8">
      <IntlLink
        href="/"
        className="text-base font-semibold text-foreground hover:text-foreground/90 sm:text-lg"
      >
        {t("appName")}
      </IntlLink>
      <nav>
        {session ? (
          <IntlLink
            href="/auth/signout"
            className="rounded-md text-xs font-medium text-foreground/90 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm"
          >
            {t("signOut")}
          </IntlLink>
        ) : (
          <Link
            href={`/api/auth/signin?callbackUrl=${signInCallback}`}
            className="rounded-md text-xs font-medium text-foreground/90 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm"
          >
            {t("signIn")}
          </Link>
        )}
      </nav>
    </header>
  );
}
