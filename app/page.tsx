import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { Button } from "../components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { PageContainer } from "@/components/page-container";
import { MainContentCard } from "@/components/main-content-card";
import { GameRulesCard } from "@/components/game-rules-card";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const playHref = session ? "/play" : "/api/auth/signin?callbackUrl=/play";

  return (
    <div className="flex min-h-screen flex-col bg-teal-50 dark:bg-teal-950">
      <SiteHeader session={session} />
      <main className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 py-0 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="flex min-h-0 w-full max-w-full flex-1 flex-col px-0 sm:max-w-2xl sm:px-6 lg:max-w-3xl lg:px-8">
          <MainContentCard>
            <div className="flex flex-1 flex-col items-center justify-center gap-6">
              <GameRulesCard />
              <Button
                asChild
                size="lg"
                className="w-full min-h-12 text-sm sm:w-auto sm:min-h-11 sm:text-base bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950"
              >
                <Link href={playHref} className="no-underline">Play</Link>
              </Button>
            </div>
          </MainContentCard>
        </PageContainer>
      </main>
    </div>
  );
}
