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
    <div className="flex min-h-screen w-full flex-col bg-teal-50 dark:bg-teal-950">
      <SiteHeader session={session} />
      <main className="flex w-full flex-1 flex-col p-0 md:flex-row md:items-center md:justify-center md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="w-full md:mx-auto md:max-w-2xl md:px-6 lg:max-w-5xl lg:px-8">
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
