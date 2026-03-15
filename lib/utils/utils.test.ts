import { cn } from ".";

describe("cn", () => {
  it("merges single class", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple classes", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional falsy", () => {
    expect(cn("foo", false && "bar", null)).toBe("foo");
  });

  it("handles conditional truthy", () => {
    expect(cn("foo", true && "bar")).toBe("foo bar");
  });

  it("merges tailwind classes and dedupes conflicting", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
