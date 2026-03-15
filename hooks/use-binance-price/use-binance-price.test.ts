import { renderHook, waitFor, act } from "@testing-library/react";
import { useBinancePrice } from ".";

const mockWsInstance = {
  onopen: () => {},
  onmessage: () => {},
  close: () => {},
};

const MockWebSocket = jest.fn(() => mockWsInstance);
(MockWebSocket as unknown as { OPEN: number }).OPEN = 1;

jest.mock("@/lib/browser-websocket", () => ({
  getWebSocketConstructor: () => MockWebSocket,
}));

describe("useBinancePrice", () => {
  beforeEach(() => {
    mockWsInstance.onopen = () => {};
    mockWsInstance.onmessage = () => {};
    mockWsInstance.close = () => {};
    MockWebSocket.mockClear();
    MockWebSocket.mockImplementation(() => mockWsInstance);
  });

  it("starts with loading true and price null", () => {
    const { result } = renderHook(() => useBinancePrice());
    expect(result.current.loading).toBe(true);
    expect(result.current.price).toBeNull();
    expect(result.current.priceHistory).toEqual([]);
  });

  it("sets loading false when WebSocket opens", async () => {
    const { result } = renderHook(() => useBinancePrice());
    await waitFor(() => {
      expect(MockWebSocket).toHaveBeenCalled();
    });
    const ws = MockWebSocket.mock.results[0].value;
    await act(async () => {
      ws.onopen();
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("updates price when trade message received", async () => {
    const { result } = renderHook(() => useBinancePrice());
    await waitFor(() => {
      expect(MockWebSocket).toHaveBeenCalled();
    });
    const ws = MockWebSocket.mock.results[0].value;
    await act(async () => {
      ws.onopen();
    });
    await act(async () => {
      ws.onmessage({
        data: JSON.stringify({ e: "trade", p: "71234.56" }),
      });
    });
    await waitFor(() => {
      expect(result.current.price).toBe(71234.56);
    });
  });
});
