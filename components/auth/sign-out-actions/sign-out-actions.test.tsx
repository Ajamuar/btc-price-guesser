import { render, screen } from "@testing-library/react";
import { SignOutActions } from "./index";

jest.mock("next-auth/react", () => ({
  getCsrfToken: jest.fn(() => Promise.resolve("csrf-token")),
}));

describe("SignOutActions", () => {
  it("renders Sign out and Cancel when csrf is loaded", async () => {
    render(<SignOutActions />);
    await screen.findByRole("button", { name: /Sign out/i });
    expect(screen.getByRole("link", { name: /Cancel/i })).toHaveAttribute("href", "/");
  });

  it("sign out form posts to signout API", async () => {
    const { container } = render(<SignOutActions />);
    await screen.findByRole("button", { name: /Sign out/i });
    const form = container.querySelector('form[action="/api/auth/signout"]');
    expect(form).toBeTruthy();
    expect(form).toHaveAttribute("method", "post");
  });
});
