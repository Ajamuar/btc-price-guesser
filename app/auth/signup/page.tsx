import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { MainContentCard } from "@/components/main-content-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = await searchParams;

  if (session) {
    redirect(callbackUrl ?? "/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-teal-50 dark:bg-teal-950">
      <SiteHeader session={session} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="flex min-h-0 w-full max-w-full flex-1 flex-col px-0 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8">
          <MainContentCard>
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                Sign up
              </h1>
              <SignUpForm callbackUrl={callbackUrl ?? "/"} />
            </div>
          </MainContentCard>
        </PageContainer>
      </main>
    </div>
  );
}
