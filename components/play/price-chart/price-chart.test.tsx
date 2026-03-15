import { render, screen } from "@testing-library/react";
import { PriceChart } from "./index";

describe("PriceChart", () => {
  it("shows connecting message when data is empty", () => {
    render(<PriceChart data={[]} />);
    expect(
      screen.getByText(/Connecting… price chart will appear when data is available/i)
    ).toBeInTheDocument();
  });

  it("renders chart when data is provided", () => {
    const data = [
      { timestamp: Date.now() - 60000, price: 71000 },
      { timestamp: Date.now(), price: 71100 },
    ];
    render(<PriceChart data={data} />);
    expect(
      screen.queryByText(/Connecting… price chart will appear when data is available/i)
    ).not.toBeInTheDocument();
  });

  it("shows guess price when priceAtGuess is set", () => {
    const data = [
      { timestamp: Date.now() - 60000, price: 71000 },
      { timestamp: Date.now(), price: 71100 },
    ];
    render(<PriceChart data={data} priceAtGuess={71050} />);
    expect(screen.getByText(/Guess price: \$71,050\.00/)).toBeInTheDocument();
  });
});
