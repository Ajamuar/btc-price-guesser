/**
 * Returns the WebSocket constructor from the current environment.
 * Isolated so tests can mock it via jest.mock().
 */
export function getWebSocketConstructor(): typeof WebSocket {
  if (typeof window !== "undefined" && window.WebSocket) {
    return window.WebSocket;
  }
  return (globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket;
}
