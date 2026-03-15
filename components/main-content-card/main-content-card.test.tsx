import { render, screen } from "@testing-library/react";
import { MainContentCard } from "./index";

describe("MainContentCard", () => {
  it("renders children", () => {
    render(
      <MainContentCard>
        <span>Card content</span>
      </MainContentCard>
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies default card classes", () => {
    const { container } = render(
      <MainContentCard>
        <div>Content</div>
      </MainContentCard>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("rounded-xl", "border", "w-full");
  });

  it("merges custom className", () => {
    const { container } = render(
      <MainContentCard className="custom-class">
        <div>Content</div>
      </MainContentCard>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });
});
