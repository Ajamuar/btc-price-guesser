import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { MainContentCard } from "@/components/main-content-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);
  const tAuth = await getTranslations("Auth");
  const tForm = await getTranslations("SignInForm");

  return (
    <div className="flex min-h-screen flex-col bg-page-canvas">
      <SiteHeader session={session} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="flex min-h-0 w-full max-w-full flex-1 flex-col px-0 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8">
          <MainContentCard>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
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
            </div>
          </MainContentCard>
        </PageContainer>
      </main>
    </div>
  );
}
