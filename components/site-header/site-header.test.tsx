import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./index";

describe("SiteHeader", () => {
  it("renders app name as home link", () => {
    render(<SiteHeader session={null} />);
    const link = screen.getByRole("link", { name: /BTC Price Guesser/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows Sign in when session is null", () => {
    render(<SiteHeader session={null} />);
    expect(screen.getByRole("link", { name: /Sign in/i })).toHaveAttribute(
      "href",
      "/api/auth/signin?callbackUrl=/"
    );
    expect(screen.queryByRole("link", { name: /Sign out/i })).not.toBeInTheDocument();
  });

  it("shows Sign out when session is present", () => {
    render(
      <SiteHeader
        session={{
          user: { id: "1", email: "a@b.com", name: "User" },
          expires: "",
        }}
      />
    );
    expect(screen.getByRole("link", { name: /Sign out/i })).toHaveAttribute(
      "href",
      "/auth/signout"
    );
    expect(screen.queryByRole("link", { name: /Sign in/i })).not.toBeInTheDocument();
  });
});
