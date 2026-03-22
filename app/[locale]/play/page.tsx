import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import { CardPageFrame, CardPageShell } from "@/components/card-page-shell";
import { PlayContent } from "@/components/play/play-content";
import { hrefForLocale } from "@/i18n/paths";

export default async function Page() {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    const playPath = hrefForLocale(locale, "/play");
    redirect(
      `${hrefForLocale(locale, "/auth/signin")}?callbackUrl=${encodeURIComponent(playPath)}`
    );
  }

  const profile = await getUserById(session.user.id);
  if (!profile) {
    const playPath = hrefForLocale(locale, "/play");
    redirect(
      `${hrefForLocale(locale, "/auth/signin")}?callbackUrl=${encodeURIComponent(playPath)}`
    );
  }

  const t = await getTranslations("Game");
  const userDisplayName =
    session.user.name ?? session.user.email ?? t("signedInFallback");

  return (
    <CardPageShell session={session}>
      <CardPageFrame variant="wide">
        <PlayContent
          userDisplayName={userDisplayName}
          initialScore={profile.score}
          initialPendingGuess={profile.pendingGuess}
          currentUserId={session.user.id}
        />
      </CardPageFrame>
    </CardPageShell>
  );
}
