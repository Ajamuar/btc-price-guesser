import { getLeaderboard } from ".";

jest.mock("@/lib/dynamodb", () => ({
  docClient: {
    send: jest.fn(),
  },
  tableName: "test-table",
}));

const docClientSend = require("@/lib/dynamodb").docClient.send as jest.Mock;

describe("getLeaderboard", () => {
  beforeEach(() => {
    docClientSend.mockReset();
  });

  it("returns empty array when no items", async () => {
    docClientSend.mockResolvedValue({ Items: [] });
    const result = await getLeaderboard(10);
    expect(result).toEqual([]);
  });

  it("maps items to LeaderboardEntry with rank", async () => {
    docClientSend.mockResolvedValue({
      Items: [
        { userId: "u1", name: "Alice", score: 10 },
        { userId: "u2", name: "Bob", score: 8 },
      ],
    });
    const result = await getLeaderboard(10);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ rank: 1, userId: "u1", name: "Alice", score: 10 });
    expect(result[1]).toEqual({ rank: 2, userId: "u2", name: "Bob", score: 8 });
  });

  it("caps limit at MAX_LIMIT", async () => {
    docClientSend.mockResolvedValue({ Items: [] });
    await getLeaderboard(200);
    const sendArg = docClientSend.mock.calls[0][0];
    expect(sendArg.input.Limit).toBe(100);
  });
});
