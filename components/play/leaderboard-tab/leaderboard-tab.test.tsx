import { render, screen } from "@testing-library/react";
import { LeaderboardTab } from "./index";

jest.mock("@/hooks/use-leaderboard", () => ({
  useLeaderboard: () => ({
    entries: [
      { rank: 1, userId: "u1", name: "Alice", score: 10 },
      { rank: 2, userId: "u2", name: "Bob", score: 8 },
    ],
    loading: false,
    error: null,
  }),
}));

describe("LeaderboardTab", () => {
  it("renders leaderboard entries", () => {
    render(<LeaderboardTab />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("highlights current user with (you)", () => {
    render(<LeaderboardTab currentUserId="u1" />);
    expect(screen.getByText("(you)")).toBeInTheDocument();
  });
});
