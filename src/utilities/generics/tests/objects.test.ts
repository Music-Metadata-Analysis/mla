import { keysToLower } from "../objects";

describe("keysToLower", () => {
  let testObject: Record<string | number | symbol, unknown>;
  let result: Record<string | number | symbol, unknown>;

  const mockObjectNonNested = {
    a: "some string",
    B: 123456,
    1: "some number",
  };
  const mockObjectNested = {
    ...mockObjectNonNested,
    nested: mockObjectNonNested,
  };

  const act = () => {
    result = keysToLower(testObject);
  };

  describe("with a non-nested test object", () => {
    beforeEach(() => (testObject = mockObjectNonNested));

    it("should transform all keys to lower case", () => {
      act();

      expect(result).toStrictEqual({
        a: "some string",
        b: 123456,
        1: "some number",
      });
    });
  });

  describe("with a nested test object", () => {
    beforeEach(() => (testObject = mockObjectNested));

    it("should transform all keys to lower case", () => {
      act();

      expect(result).toStrictEqual({
        a: "some string",
        b: 123456,
        1: "some number",
        nested: {
          a: "some string",
          b: 123456,
          1: "some number",
        },
      });
    });
  });
});
