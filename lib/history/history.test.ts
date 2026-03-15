import { getGuessHistory } from ".";

jest.mock("@/lib/dynamodb", () => ({
  docClient: { send: jest.fn() },
  tableName: "test-table",
}));

const docClientSend = require("@/lib/dynamodb").docClient.send as jest.Mock;

describe("getGuessHistory", () => {
  beforeEach(() => {
    docClientSend.mockReset();
  });

  it("returns empty array when no items", async () => {
    docClientSend.mockResolvedValue({ Items: [] });
    const result = await getGuessHistory("user1");
    expect(result).toEqual([]);
  });

  it("maps items to GuessHistoryItem", async () => {
    docClientSend.mockResolvedValue({
      Items: [
        {
          direction: "up",
          timestamp: 1000,
          priceAtGuess: 71000,
          result: "win",
          priceAtResolution: 71100,
          scoreAfter: 1,
        },
      ],
    });
    const result = await getGuessHistory("user1");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      direction: "up",
      timestamp: 1000,
      priceAtGuess: 71000,
      result: "win",
      priceAtResolution: 71100,
      scoreAfter: 1,
    });
  });

  it("uses correct pk for userId", async () => {
    docClientSend.mockResolvedValue({ Items: [] });
    await getGuessHistory("abc-123");
    const sendArg = docClientSend.mock.calls[0][0];
    expect(sendArg.input.ExpressionAttributeValues[":pk"]).toBe("USER#abc-123");
  });
});
