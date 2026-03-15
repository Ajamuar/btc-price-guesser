import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { MainContentCard } from "@/components/main-content-card";
import { PlayContent } from "@/components/play/play-content";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/play");
  }

  const profile = await getUserById(session.user.id);
  if (!profile) {
    redirect("/auth/signin?callbackUrl=/play");
  }

  const userDisplayName =
    session.user.name ?? session.user.email ?? "Signed in";

  return (
    <div className="flex min-h-screen flex-col bg-teal-50 dark:bg-teal-950">
      <SiteHeader session={session} />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl">
          <MainContentCard>
            <PlayContent
              userDisplayName={userDisplayName}
              initialScore={profile.score}
              initialPendingGuess={profile.pendingGuess}
              currentUserId={session.user.id}
            />
          </MainContentCard>
        </PageContainer>
      </main>
    </div>
  );
}
