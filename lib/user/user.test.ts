import { getUserById } from ".";

jest.mock("@/lib/dynamodb", () => ({
  docClient: { send: jest.fn() },
  tableName: "test-table",
}));

const docClientSend = require("@/lib/dynamodb").docClient.send as jest.Mock;

describe("getUserById", () => {
  beforeEach(() => {
    docClientSend.mockReset();
  });

  it("returns null when no item", async () => {
    docClientSend.mockResolvedValue({ Item: undefined });
    const result = await getUserById("user1");
    expect(result).toBeNull();
  });

  it("maps Item to UserProfile", async () => {
    docClientSend.mockResolvedValue({
      Item: {
        userId: "u1",
        email: "a@b.com",
        name: "Alice",
        score: 5,
        pendingGuess: null,
      },
    });
    const result = await getUserById("u1");
    expect(result).toEqual({
      userId: "u1",
      email: "a@b.com",
      name: "Alice",
      score: 5,
      pendingGuess: null,
    });
  });

  it("uses correct key", async () => {
    docClientSend.mockResolvedValue({ Item: null });
    await getUserById("xyz");
    const sendArg = docClientSend.mock.calls[0][0];
    expect(sendArg.input).toMatchObject({
      Key: { pk: "USER#xyz", sk: "PROFILE" },
    });
  });
});
