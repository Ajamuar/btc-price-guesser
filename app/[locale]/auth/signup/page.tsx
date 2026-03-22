import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { MainContentCard } from "@/components/main-content-card";
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
    <div className="flex min-h-screen flex-col bg-page-canvas">
      <SiteHeader session={session} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="flex min-h-0 w-full max-w-full flex-1 flex-col px-0 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8">
          <MainContentCard>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
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
            </div>
          </MainContentCard>
        </PageContainer>
      </main>
    </div>
  );
}
