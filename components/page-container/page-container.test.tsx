import { render, screen } from "@testing-library/react";
import { PageContainer } from "./index";

describe("PageContainer", () => {
  it("renders children", () => {
    render(
      <PageContainer>
        <span>Hello</span>
      </PageContainer>
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies default narrow layout classes", () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("w-full", "max-w-full", "sm:max-w-2xl");
  });

  it("applies medium variant classes", () => {
    const { container } = render(
      <PageContainer variant="medium">
        <div>Content</div>
      </PageContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("sm:max-w-3xl", "lg:max-w-4xl", "xl:max-w-5xl");
  });

  it("applies wide variant classes", () => {
    const { container } = render(
      <PageContainer variant="wide">
        <div>Content</div>
      </PageContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("sm:max-w-4xl", "lg:max-w-7xl");
  });

  it("merges custom className", () => {
    const { container } = render(
      <PageContainer className="custom-class">
        <div>Content</div>
      </PageContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });
});
