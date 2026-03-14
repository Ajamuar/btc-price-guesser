import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { SignInForm } from "@/components/auth/sign-in-form";

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-teal-50 dark:bg-teal-950">
      <SiteHeader session={session} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl">
          <div className="w-full rounded-xl border border-teal-200/60 bg-white px-8 py-10 shadow-lg sm:px-12 sm:py-14 dark:border-teal-800/50 dark:bg-card">
            <div className="flex flex-col items-center gap-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Sign in
              </h1>
              <SignInForm callbackUrl={callbackUrl ?? "/"} />
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
