import { docClient, tableName } from ".";

describe("dynamodb", () => {
  it("exports docClient", () => {
    expect(docClient).toBeDefined();
    expect(typeof docClient.send).toBe("function");
  });

  it("exports tableName as non-empty string when env is set or default", () => {
    expect(typeof tableName).toBe("string");
    expect(tableName.length).toBeGreaterThan(0);
  });
});
