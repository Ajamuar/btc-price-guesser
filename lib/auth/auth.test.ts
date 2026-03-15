import { authOptions } from ".";

describe("authOptions", () => {
  it("has session strategy jwt", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("has signIn page", () => {
    expect(authOptions.pages?.signIn).toBe("/auth/signin");
  });

  it("has Google and Credentials providers", () => {
    const ids = authOptions.providers?.map((p) => p.id) ?? [];
    expect(ids).toContain("google");
    expect(ids).toContain("credentials");
  });
});
