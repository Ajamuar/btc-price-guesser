import { getBinancePriceAtTime } from ".";

describe("getBinancePriceAtTime", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("returns null when response is not ok", async () => {
    jest.mocked(fetch).mockResolvedValue({ ok: false } as Response);
    const result = await getBinancePriceAtTime(Date.now());
    expect(result).toBeNull();
  });

  it("returns null when kline data is empty", async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
    const result = await getBinancePriceAtTime(Date.now());
    expect(result).toBeNull();
  });

  it("returns close price when kline is valid", async () => {
    jest.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([[0, "0", "0", "0", "71234.56", "0"]]),
    } as Response);
    const result = await getBinancePriceAtTime(1000000);
    expect(result).toBe(71234.56);
  });
});
