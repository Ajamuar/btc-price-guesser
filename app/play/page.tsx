import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import { SiteHeader } from "@/components/site-header";
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
    <div className="flex min-h-screen w-full flex-col bg-page-canvas">
      <SiteHeader session={session} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="w-full max-w-full px-0 sm:max-w-4xl sm:px-6 lg:max-w-7xl lg:px-8 xl:max-w-[88rem] 2xl:max-w-[96rem]">
          <MainContentCard>
            <PlayContent
              userDisplayName={userDisplayName}
              initialScore={profile.score}
              initialPendingGuess={profile.pendingGuess}
              currentUserId={session.user.id}
            />
          </MainContentCard>
        </div>
      </main>
    </div>
  );
}
