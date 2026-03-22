import { getTranslations } from "next-intl/server";

export async function GameRulesCard() {
  const t = await getTranslations("GameRules");

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
        {t("title")}
      </h1>
      <div className="space-y-2 text-left text-sm text-muted-foreground sm:text-base">
        <p className="font-medium text-foreground">{t("rulesHeading")}</p>
        <ul className="list-inside list-disc space-y-1">
          <li>{t("ruleGuess")}</li>
          <li>{t("ruleResolution")}</li>
          <li>{t("ruleScore")}</li>
          <li>{t("ruleSignIn")}</li>
        </ul>
      </div>
    </div>
  );
}
