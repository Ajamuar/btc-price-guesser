import { getTranslations } from "next-intl/server";

export async function GameRulesCard() {
  const t = await getTranslations("GameRules");

  return (
    <section
      className="flex w-full flex-col items-center gap-6 text-center"
      aria-labelledby="game-rules-title"
    >
      <h1
        id="game-rules-title"
        className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl"
      >
        {t("title")}
      </h1>
      <section
        className="w-full space-y-2 text-left text-sm text-muted-foreground sm:text-base"
        aria-labelledby="game-rules-heading"
      >
        <h2 id="game-rules-heading" className="font-medium text-foreground">
          {t("rulesHeading")}
        </h2>
        <ul className="list-outside list-disc space-y-2 pl-6 marker:text-muted-foreground">
          <li>{t("ruleGuess")}</li>
          <li>{t("ruleResolution")}</li>
          <li>{t("ruleScore")}</li>
          <li>{t("ruleSignIn")}</li>
        </ul>
      </section>
    </section>
  );
}
