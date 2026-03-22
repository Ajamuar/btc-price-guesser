import { render, screen } from "@testing-library/react";
import { GameContainer } from "./index";

const mockHandleGuess = jest.fn();
jest.mock("@/hooks/use-binance-price", () => ({
  useBinancePrice: () => ({
    price: 71000,
    priceHistory: [{ timestamp: Date.now(), price: 71000 }],
    loading: false,
    error: null,
  }),
}));
jest.mock("@/hooks/use-game-play", () => ({
  useGamePlay: () => ({
    score: 0,
    pendingGuess: null,
    guessLoading: false,
    lastResult: null,
    lastResolution: null,
    nextCheckInSeconds: null,
    handleGuess: mockHandleGuess,
    priceAtGuess: null,
    guessError: null,
    mePollError: null,
  }),
}));

describe("GameContainer", () => {
  beforeEach(() => {
    mockHandleGuess.mockClear();
  });

  it("renders greeting and score", () => {
    render(
      <GameContainer initialScore={3} initialPendingGuess={null} userDisplayName="Alex" />
    );
    expect(screen.getByText(/Hi Alex, Let's Play/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 0/)).toBeInTheDocument();
  });

  it("renders Up and Down buttons", () => {
    render(
      <GameContainer initialScore={0} initialPendingGuess={null} />
    );
    expect(screen.getByText("Up")).toBeInTheDocument();
    expect(screen.getByText("Down")).toBeInTheDocument();
  });
});
