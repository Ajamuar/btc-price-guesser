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

  it("applies default layout classes", () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("mx-auto", "max-w-2xl", "px-4");
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
