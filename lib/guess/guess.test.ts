import { tryResolve } from ".";

jest.mock("@/lib/dynamodb", () => ({
  docClient: { send: jest.fn() },
  tableName: "test-table",
}));
jest.mock("@/lib/user", () => ({
  getUserById: jest.fn(),
}));
jest.mock("@/lib/binance", () => ({
  getBinancePriceAtTime: jest.fn(),
}));

const getUserById = require("@/lib/user").getUserById as jest.Mock;
const getBinancePriceAtTime = require("@/lib/binance").getBinancePriceAtTime as jest.Mock;
const docClientSend = require("@/lib/dynamodb").docClient.send as jest.Mock;

describe("tryResolve", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when user has no pending guess", async () => {
    getUserById.mockResolvedValue({ userId: "u1", pendingGuess: null });
    const result = await tryResolve("u1");
    expect(result).toBeNull();
    expect(getBinancePriceAtTime).not.toHaveBeenCalled();
  });

  it("returns profile when elapsed < 60s", async () => {
    const profile = {
      userId: "u1",
      score: 0,
      pendingGuess: {
        direction: "up",
        timestamp: Date.now() - 30_000,
        priceAtGuess: 71000,
      },
    };
    getUserById.mockResolvedValue(profile);
    const result = await tryResolve("u1");
    expect(result).toEqual({ profile });
    expect(getBinancePriceAtTime).not.toHaveBeenCalled();
  });
});
