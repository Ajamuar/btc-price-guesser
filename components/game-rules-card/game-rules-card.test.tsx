import { render, screen } from "@testing-library/react";
import { GameRulesCard } from "./index";

describe("GameRulesCard", () => {
  it("renders heading", async () => {
    const ui = await GameRulesCard();
    render(ui);
    expect(screen.getByRole("heading", { name: /BTC Price Guesser/i })).toBeInTheDocument();
  });

  it("renders Rules label", async () => {
    const ui = await GameRulesCard();
    render(ui);
    expect(screen.getByText(/^Rules:/)).toBeInTheDocument();
  });

  it("renders guess up or down rule", async () => {
    const ui = await GameRulesCard();
    render(ui);
    expect(screen.getByText(/Guess if BTC goes/)).toBeInTheDocument();
  });

  it("renders resolution and score rules", async () => {
    const ui = await GameRulesCard();
    render(ui);
    expect(screen.getByText(/Resolution: 60s/)).toBeInTheDocument();
    expect(screen.getByText(/Score: \+1 correct/)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to play/)).toBeInTheDocument();
  });
});
