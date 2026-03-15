import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlayTabs } from "./index";

jest.mock("@/components/play/leaderboard-tab", () => ({
  LeaderboardTab: () => <div data-testid="leaderboard-tab">Leaderboard</div>,
}));
jest.mock("@/components/play/history-tab", () => ({
  HistoryTab: () => <div data-testid="history-tab">History</div>,
}));

describe("PlayTabs", () => {
  it("renders Leaderboard and History triggers", () => {
    render(<PlayTabs />);
    expect(screen.getByRole("tab", { name: /Leaderboard/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /History/i })).toBeInTheDocument();
  });

  it("shows leaderboard content by default", () => {
    render(<PlayTabs />);
    expect(screen.getByTestId("leaderboard-tab")).toBeInTheDocument();
  });

  it("switches to History when History tab is clicked", async () => {
    const user = userEvent.setup();
    render(<PlayTabs />);
    await user.click(screen.getByRole("tab", { name: /History/i }));
    expect(screen.getByRole("tab", { name: /History/i })).toHaveAttribute(
      "data-state",
      "active"
    );
  });
});
