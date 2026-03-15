import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GuessButtons } from "./index";

describe("GuessButtons", () => {
  const onGuess = jest.fn();

  beforeEach(() => {
    onGuess.mockClear();
  });

  it("renders Up and Down buttons", () => {
    render(
      <GuessButtons
        hasPendingGuess={false}
        selectedDirection={null}
        onGuess={onGuess}
        currentPrice={71000}
      />
    );
    expect(screen.getByRole("button", { name: /Up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Down/i })).toBeInTheDocument();
  });

  it("disables buttons when hasPendingGuess is true", () => {
    render(
      <GuessButtons
        hasPendingGuess
        selectedDirection="up"
        onGuess={onGuess}
        currentPrice={71000}
      />
    );
    expect(screen.getByRole("button", { name: /Up/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Down/i })).toBeDisabled();
  });

  it("calls onGuess with up and price when Up is clicked", async () => {
    const user = userEvent.setup();
    render(
      <GuessButtons
        hasPendingGuess={false}
        selectedDirection={null}
        onGuess={onGuess}
        currentPrice={71500}
      />
    );
    await user.click(screen.getByRole("button", { name: /Up/i }));
    expect(onGuess).toHaveBeenCalledWith("up", 71500);
  });

  it("calls onGuess with down and price when Down is clicked", async () => {
    const user = userEvent.setup();
    render(
      <GuessButtons
        hasPendingGuess={false}
        selectedDirection={null}
        onGuess={onGuess}
        currentPrice={71000}
      />
    );
    await user.click(screen.getByRole("button", { name: /Down/i }));
    expect(onGuess).toHaveBeenCalledWith("down", 71000);
  });
});
