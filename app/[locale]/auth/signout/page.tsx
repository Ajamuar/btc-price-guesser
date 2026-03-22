import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { MainContentCard } from "@/components/main-content-card";
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
    <div className="flex min-h-screen flex-col bg-page-canvas">
      <SiteHeader session={session} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="flex min-h-0 w-full max-w-full flex-1 flex-col px-0 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8">
          <MainContentCard>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {tAuth("signOutTitle")}
              </h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {tAuth("signOutConfirm")}
              </p>
              <SignOutActions />
            </div>
          </MainContentCard>
        </PageContainer>
      </main>
    </div>
  );
}
