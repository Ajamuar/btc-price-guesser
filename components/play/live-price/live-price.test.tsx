import { render, screen } from "@testing-library/react";
import { LivePrice } from "./index";

describe("LivePrice", () => {
  it("shows connecting when loading", () => {
    render(<LivePrice price={null} loading />);
    expect(screen.getByText("Connecting…")).toBeInTheDocument();
  });

  it("shows dash when price is null and not loading", () => {
    render(<LivePrice price={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows error message when error is set", () => {
    render(<LivePrice price={null} error="Network error" />);
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("shows formatted BTC price when price is set", () => {
    render(<LivePrice price={71462.5} />);
    expect(screen.getByText(/BTC:/)).toBeInTheDocument();
    expect(screen.getByText(/71,462\.50/)).toBeInTheDocument();
  });
});
