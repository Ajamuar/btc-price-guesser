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
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <PageContainer className="w-full max-w-full sm:max-w-2xl lg:max-w-3xl">
          <MainContentCard>
            <div className="flex flex-col items-center gap-6">
              <GameRulesCard />
              <Button
                asChild
                size="lg"
                className="w-full min-h-12 sm:w-auto sm:min-h-11 bg-teal-600 text-white shadow-md no-underline hover:bg-teal-700 hover:text-white focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-50 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-teal-950"
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
