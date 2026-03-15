import { renderHook, waitFor } from "@testing-library/react";
import { useLeaderboard } from ".";

describe("useLeaderboard", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("fetches leaderboard and returns entries", async () => {
    const mockEntries = [
      { rank: 1, userId: "u1", name: "Alice", score: 10 },
      { rank: 2, userId: "u2", name: "Bob", score: 5 },
    ];
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ entries: mockEntries }),
    } as Response);

    const { result } = renderHook(() => useLeaderboard(50));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.entries).toEqual(mockEntries);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith(
      "/api/leaderboard?limit=50",
      expect.any(Object)
    );
  });

  it("sets error on non-ok response", async () => {
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useLeaderboard(50));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to load leaderboard");
  });
});
