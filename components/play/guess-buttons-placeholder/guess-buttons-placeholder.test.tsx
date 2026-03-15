import { render, screen } from "@testing-library/react";
import { GuessButtonsPlaceholder } from "./index";

describe("GuessButtonsPlaceholder", () => {
  it("renders disabled Up and Down buttons", () => {
    render(<GuessButtonsPlaceholder />);
    expect(screen.getByRole("button", { name: /Up/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Down/i })).toBeDisabled();
  });

  it("renders Phase 4 message", () => {
    render(<GuessButtonsPlaceholder />);
    expect(screen.getByText(/Guess in Phase 4/i)).toBeInTheDocument();
  });
});
