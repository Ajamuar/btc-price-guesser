import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import {
  CardPageFrame,
  CardPageShell,
  CARD_PAGE_INNER_STACK_TEXT_CLASS,
} from "@/components/card-page-shell";
import { SignOutActions } from "@/components/auth/sign-out-actions";
import { hrefForLocale } from "@/i18n/paths";

export default async function SignOutPage() {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);
  const tAuth = await getTranslations("Auth");

  if (!session) {
    redirect(hrefForLocale(locale, "/"));
  }

  return (
    <CardPageShell session={session}>
      <CardPageFrame innerClassName={CARD_PAGE_INNER_STACK_TEXT_CLASS}>
        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {tAuth("signOutTitle")}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {tAuth("signOutConfirm")}
        </p>
        <SignOutActions />
      </CardPageFrame>
    </CardPageShell>
  );
}
