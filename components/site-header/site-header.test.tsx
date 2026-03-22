import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./index";

describe("SiteHeader", () => {
  it("renders app name as home link", async () => {
    const ui = await SiteHeader({ session: null });
    render(ui);
    const link = screen.getByRole("link", { name: /BTC Price Guesser/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("shows Sign in when session is null", async () => {
    const ui = await SiteHeader({ session: null });
    render(ui);
    expect(screen.getByRole("link", { name: /Sign in/i })).toHaveAttribute(
      "href",
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/")}`
    );
    expect(screen.queryByRole("link", { name: /Sign out/i })).not.toBeInTheDocument();
  });

  it("shows Sign out when session is present", async () => {
    const ui = await SiteHeader({
      session: {
        user: { id: "1", email: "a@b.com", name: "User" },
        expires: "",
      },
    });
    render(ui);
    expect(screen.getByRole("link", { name: /Sign out/i })).toHaveAttribute(
      "href",
      "/auth/signout"
    );
    expect(screen.queryByRole("link", { name: /Sign in/i })).not.toBeInTheDocument();
  });
});
