import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import {
  CardPageFrame,
  CardPageShell,
  CARD_PAGE_INNER_STACK_TEXT_CLASS,
} from "@/components/card-page-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  const tAuth = await getTranslations("Auth");
  const tForm = await getTranslations("SignInForm");

  return (
    <CardPageShell session={session}>
      <CardPageFrame innerClassName={CARD_PAGE_INNER_STACK_TEXT_CLASS}>
        <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
          {tAuth("signInTitle")}
        </h1>
        <Suspense
          fallback={
            <div className="flex justify-center py-8 text-muted-foreground">
              {tForm("loading")}
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </CardPageFrame>
    </CardPageShell>
  );
}
