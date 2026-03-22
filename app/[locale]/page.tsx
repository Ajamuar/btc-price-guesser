import { getServerSession } from "next-auth";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  CardPageFrame,
  CardPageShell,
  CARD_PAGE_INNER_STACK_CLASS,
} from "@/components/card-page-shell";
import { GameRulesCard } from "@/components/game-rules-card";
import { Link as IntlLink } from "@/i18n/navigation";
import { hrefForLocale } from "@/i18n/paths";

export default async function Home() {
  const locale = await getLocale();
  const t = await getTranslations("Home");
  const session = await getServerSession(authOptions);
  const playPath = hrefForLocale(locale, "/play");
  const playHref = session
    ? playPath
    : `/api/auth/signin?callbackUrl=${encodeURIComponent(playPath)}`;

  return (
    <CardPageShell session={session}>
      <CardPageFrame innerClassName={CARD_PAGE_INNER_STACK_CLASS}>
        <GameRulesCard />
        <Button
          asChild
          size="lg"
          className="w-full min-h-12 text-sm sm:w-auto sm:min-h-11 sm:text-base bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          {session ? (
            <IntlLink href="/play" className="no-underline">
              {t("play")}
            </IntlLink>
          ) : (
            <Link href={playHref} className="no-underline">
              {t("play")}
            </Link>
          )}
        </Button>
      </CardPageFrame>
    </CardPageShell>
  );
}
