import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./index";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /Click me/i })).toBeInTheDocument();
  });

  it("applies variant and size via data attributes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>
    );
    const btn = screen.getByRole("button", { name: /Delete/i });
    expect(btn).toHaveAttribute("data-variant", "destructive");
    expect(btn).toHaveAttribute("data-size", "lg");
  });

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Submit</Button>);
    await user.click(screen.getByRole("button", { name: /Submit/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(
      <Button onClick={handleClick} disabled>
        Submit
      </Button>
    );
    const btn = screen.getByRole("button", { name: /Submit/i });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
