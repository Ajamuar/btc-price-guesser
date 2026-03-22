import { Suspense } from "react";
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
import { SignUpForm } from "@/components/auth/sign-up-form";
import { hrefForLocale } from "@/i18n/paths";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: Props) {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);
  const { callbackUrl } = await searchParams;
  const tAuth = await getTranslations("Auth");
  const tForm = await getTranslations("SignUpForm");

  if (session) {
    redirect(callbackUrl ?? hrefForLocale(locale, "/"));
  }

  return (
    <CardPageShell session={session}>
      <CardPageFrame innerClassName={CARD_PAGE_INNER_STACK_TEXT_CLASS}>
        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {tAuth("signUpTitle")}
        </h1>
        <Suspense
          fallback={
            <div className="flex justify-center py-8 text-muted-foreground">
              {tForm("loading")}
            </div>
          }
        >
          <SignUpForm />
        </Suspense>
      </CardPageFrame>
    </CardPageShell>
  );
}
