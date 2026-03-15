import { render, screen } from "@testing-library/react";
import { PlayContent } from "./index";

jest.mock("@/components/play/game-container", () => ({
  GameContainer: ({ userDisplayName }: { userDisplayName?: string | null }) => (
    <div data-testid="game-container">Game {userDisplayName ?? "…"}</div>
  ),
}));
jest.mock("@/components/play/play-tabs", () => ({
  PlayTabs: () => <div data-testid="play-tabs">Tabs</div>,
}));

describe("PlayContent", () => {
  it("renders GameContainer and PlayTabs", () => {
    render(
      <PlayContent
        initialScore={0}
        initialPendingGuess={null}
        userDisplayName="Test"
      />
    );
    expect(screen.getByTestId("game-container")).toBeInTheDocument();
    expect(screen.getByTestId("play-tabs")).toBeInTheDocument();
  });

  it("passes userDisplayName to GameContainer", () => {
    render(
      <PlayContent
        initialScore={5}
        initialPendingGuess={null}
        userDisplayName="Alice"
      />
    );
    expect(screen.getByText("Game Alice")).toBeInTheDocument();
  });
});
