import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "./index";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

describe("SignUpForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    global.fetch = jest.fn();
  });

  it("renders email, password, name fields and Create account button", () => {
    render(<SignUpForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create account/i })).toBeInTheDocument();
  });

  it("renders Sign in link", () => {
    render(<SignUpForm />);
    expect(screen.getByRole("link", { name: /Sign in/i })).toHaveAttribute(
      "href",
      "/auth/signin"
    );
  });

  it("shows error on 409 response", async () => {
    const user = userEvent.setup();
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: () => Promise.resolve({ error: "Email already registered" }),
    } as Response);

    render(<SignUpForm />);
    await user.type(screen.getByLabelText(/Email/i), "a@b.com");
    await user.type(screen.getByLabelText(/Password/i), "password123");
    await user.click(screen.getByRole("button", { name: /Create account/i }));

    await screen.findByRole("alert");
    expect(screen.getByText(/Email already registered/i)).toBeInTheDocument();
  });
});
