import { renderHook, waitFor } from "@testing-library/react";
import { useHistory } from ".";

describe("useHistory", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches history and returns data", async () => {
    const mockHistory = [
      {
        direction: "up",
        timestamp: 1000,
        priceAtGuess: 71000,
        result: "win" as const,
        priceAtResolution: 71100,
        scoreAfter: 1,
      },
    ];
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ history: mockHistory }),
    } as Response);

    const { result } = renderHook(() => useHistory(50));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.history).toEqual(mockHistory);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      "/api/me/history?limit=50",
      expect.any(Object)
    );
  });

  it("sets error on non-ok response", async () => {
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useHistory(50));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load history");
  });
});
