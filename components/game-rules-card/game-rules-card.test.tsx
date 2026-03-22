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
    expect(
      screen.getByText(/Predict whether Bitcoin.*one minute after you guess/i)
    ).toBeInTheDocument();
  });

  it("renders resolution and score rules", async () => {
    const ui = await GameRulesCard();
    render(ui);
    expect(screen.getByText(/After one minute, we compare/)).toBeInTheDocument();
    expect(screen.getByText(/tie after two minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Score: \+1 correct/)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to play/)).toBeInTheDocument();
  });
});
