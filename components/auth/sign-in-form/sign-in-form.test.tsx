import { render, screen } from "@testing-library/react";
import { SignInForm } from "./index";

jest.mock("next-auth/react", () => ({
  getCsrfToken: jest.fn(() => Promise.resolve("csrf-token")),
  getProviders: jest.fn(() =>
    Promise.resolve({
      credentials: { id: "credentials", name: "Credentials" },
      google: { id: "google", name: "Google" },
    })
  ),
  signIn: jest.fn(),
}));

describe("SignInForm", () => {
  beforeEach(() => {
    jest.mocked(require("next-auth/react").getCsrfToken).mockResolvedValue("csrf-token");
    jest.mocked(require("next-auth/react").getProviders).mockResolvedValue({
      credentials: { id: "credentials", name: "Credentials" },
      google: { id: "google", name: "Google" },
    });
  });

  it("renders email and password fields when credentials provider is available", async () => {
    render(<SignInForm />);
    await screen.findByLabelText(/Email/i);
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Sign in$/ })).toBeInTheDocument();
  });

  it("renders Sign up link", async () => {
    render(<SignInForm />);
    await screen.findByLabelText(/Email/i);
    expect(screen.getByRole("link", { name: /Sign up/i })).toHaveAttribute(
      "href",
      "/auth/signup"
    );
  });
});
