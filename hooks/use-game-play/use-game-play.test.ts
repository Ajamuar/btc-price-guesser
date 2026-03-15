import { renderHook, act, waitFor } from "@testing-library/react";
import { useGamePlay } from ".";

describe("useGamePlay", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("returns initial score and no pending guess", () => {
    const { result } = renderHook(() =>
      useGamePlay({ initialScore: 5, initialPendingGuess: null })
    );
    expect(result.current.score).toBe(5);
    expect(result.current.pendingGuess).toBeNull();
    expect(result.current.lastResult).toBeNull();
  });

  it("handleGuess calls fetch and updates state on success", async () => {
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      text: () =>
        Promise.resolve(
          JSON.stringify({
            score: 5,
            pendingGuess: {
              direction: "up",
              timestamp: Date.now(),
              priceAtGuess: 71000,
            },
          })
        ),
    } as Response);

    const { result } = renderHook(() =>
      useGamePlay({ initialScore: 4, initialPendingGuess: null })
    );

    await act(async () => {
      await result.current.handleGuess("up", 71000);
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/guess",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ direction: "up", priceAtGuess: 71000 }),
      })
    );
    await waitFor(() => {
      expect(result.current.pendingGuess).not.toBeNull();
      expect(result.current.pendingGuess?.direction).toBe("up");
    });
  });
});
