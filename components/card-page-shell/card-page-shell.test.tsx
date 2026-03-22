import { render, screen } from "@testing-library/react";
import { CardPageFrame, CardPageShell } from "./index";

jest.mock("@/components/site-header", () => ({
  SiteHeader: () => <header data-testid="site-header">header</header>,
}));

describe("CardPageShell", () => {
  it("renders children in main", () => {
    render(
      <CardPageShell session={null}>
        <span>Main child</span>
      </CardPageShell>
    );
    expect(screen.getByText("Main child")).toBeInTheDocument();
  });

  it("applies shared outer and main layout classes", () => {
    const { container } = render(
      <CardPageShell session={null}>
        <div />
      </CardPageShell>
    );
    const outer = container.firstChild;
    expect(outer).toHaveClass(
      "flex",
      "min-h-screen",
      "w-full",
      "flex-col",
      "bg-page-canvas"
    );
    const main = container.querySelector("main");
    expect(main).toHaveClass(
      "flex",
      "min-h-0",
      "flex-1",
      "flex-col",
      "items-center",
      "justify-center"
    );
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabIndex", "-1");
    expect(main).toHaveAttribute("aria-label", "Main content");
  });

  it("merges custom className on outer shell", () => {
    const { container } = render(
      <CardPageShell session={null} className="extra-outer">
        <div />
      </CardPageShell>
    );
    expect(container.firstChild).toHaveClass("extra-outer");
  });
});

describe("CardPageFrame", () => {
  it("renders children inside MainContentCard", () => {
    render(
      <CardPageFrame>
        <span>Inside card</span>
      </CardPageFrame>
    );
    expect(screen.getByText("Inside card")).toBeInTheDocument();
  });

  it("wraps children when innerClassName is set", () => {
    const { container } = render(
      <CardPageFrame innerClassName="inner-wrap">
        <span>X</span>
      </CardPageFrame>
    );
    const wrap = container.querySelector(".inner-wrap");
    expect(wrap).toBeInTheDocument();
    expect(wrap).toContainHTML("X");
  });
});
