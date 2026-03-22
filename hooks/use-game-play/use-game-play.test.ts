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
    expect(result.current.guessError).toBeNull();
    expect(result.current.mePollError).toBeNull();
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

  it("sets guessError to network when fetch rejects", async () => {
    jest.mocked(fetch).mockRejectedValueOnce(new Error("network"));

    const { result } = renderHook(() =>
      useGamePlay({ initialScore: 0, initialPendingGuess: null })
    );

    await act(async () => {
      await result.current.handleGuess("up", 71000);
    });

    await waitFor(() => {
      expect(result.current.guessError).toBe("network");
    });
  });

  it("sets guessError to server when response is not ok", async () => {
    jest.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve(JSON.stringify({ error: "bad" })),
    } as Response);

    const { result } = renderHook(() =>
      useGamePlay({ initialScore: 0, initialPendingGuess: null })
    );

    await act(async () => {
      await result.current.handleGuess("down", 70000);
    });

    await waitFor(() => {
      expect(result.current.guessError).toBe("server");
    });
  });

  it("stops polling and sets mePollError after 5 consecutive /api/me failures", async () => {
    jest.useFakeTimers();
    try {
      const pendingGuess = {
        direction: "up",
        timestamp: Date.now() - 61_000,
        priceAtGuess: 70000,
      };
      jest.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(""),
      } as Response);

      const { result } = renderHook(() =>
        useGamePlay({ initialScore: 0, initialPendingGuess: pendingGuess })
      );

      for (let i = 0; i < 5; i++) {
        await act(async () => {
          await jest.advanceTimersByTimeAsync(1000);
        });
      }

      expect(result.current.mePollError).toBe("stopped");
    } finally {
      jest.useRealTimers();
    }
  });
});
