import { render, screen } from "@testing-library/react";
import { GameRulesCard } from "./index";

describe("GameRulesCard", () => {
  it("renders heading", () => {
    render(<GameRulesCard />);
    expect(screen.getByRole("heading", { name: /BTC Price Guesser/i })).toBeInTheDocument();
  });

  it("renders Rules label", () => {
    render(<GameRulesCard />);
    expect(screen.getByText(/^Rules:/)).toBeInTheDocument();
  });

  it("renders guess up or down rule", () => {
    render(<GameRulesCard />);
    expect(screen.getByText(/Guess if BTC goes/)).toBeInTheDocument();
    expect(screen.getByText("up")).toBeInTheDocument();
    expect(screen.getByText("down")).toBeInTheDocument();
  });

  it("renders resolution and score rules", () => {
    render(<GameRulesCard />);
    expect(screen.getByText(/Resolution: 60s/)).toBeInTheDocument();
    expect(screen.getByText(/Score: \+1 correct/)).toBeInTheDocument();
    expect(screen.getByText(/Sign in to play/)).toBeInTheDocument();
  });
});
