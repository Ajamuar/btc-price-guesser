export function GameRulesCard() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        BTC Price Guesser
      </h1>
      <div className="space-y-2 text-left text-base text-muted-foreground">
        <p className="font-medium text-foreground">Rules:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            Guess if BTC goes <strong>up</strong> or <strong>down</strong> after 1 minute.
          </li>
          <li>Resolution: 60s if price changed; otherwise tie at 2 minutes.</li>
          <li>Score: +1 correct, -1 wrong, 0 tie. One guess at a time.</li>
          <li>Sign in to play.</li>
        </ul>
      </div>
    </div>
  );
}
