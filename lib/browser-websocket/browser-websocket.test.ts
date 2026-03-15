import { getWebSocketConstructor } from ".";

describe("getWebSocketConstructor", () => {
  it("returns a function (WebSocket constructor)", () => {
    const Ctor = getWebSocketConstructor();
    expect(typeof Ctor).toBe("function");
  });

  it("returns constructor with OPEN constant in jsdom", () => {
    const Ctor = getWebSocketConstructor();
    expect((Ctor as unknown as { OPEN?: number }).OPEN).toBe(1);
  });
});
