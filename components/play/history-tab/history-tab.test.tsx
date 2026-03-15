import { render, screen } from "@testing-library/react";
import { HistoryTab } from "./index";

jest.mock("@/hooks/use-history", () => ({
  useHistory: () => ({
    history: [
      {
        direction: "up",
        timestamp: Date.now() - 86400000,
        priceAtGuess: 71000,
        result: "win" as const,
        priceAtResolution: 71100,
        scoreAfter: 1,
      },
    ],
    loading: false,
    error: null,
  }),
}));

describe("HistoryTab", () => {
  it("renders history entry with direction and result", () => {
    render(<HistoryTab />);
    expect(screen.getByText(/up/i)).toBeInTheDocument();
    expect(screen.getByText("Win")).toBeInTheDocument();
  });

  it("renders price range and score after", () => {
    render(<HistoryTab />);
    expect(screen.getByText(/\$71,000 → \$71,100/)).toBeInTheDocument();
    expect(screen.getByText(/Score after: 1/)).toBeInTheDocument();
  });
});
