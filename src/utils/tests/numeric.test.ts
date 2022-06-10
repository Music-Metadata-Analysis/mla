import { valueToZero } from "../numeric";

describe("valueToZero", () => {
  let result: number;

  const arrange = (input: number | undefined | null) => {
    result = valueToZero(input);
  };

  describe("with a numeric input", () => {
    beforeEach(() => arrange(10));

    it("should return the expected string", () => {
      expect(result).toBe(10);
    });
  });

  describe("with an undefined input", () => {
    beforeEach(() => arrange(undefined));

    it("should return the expected string", () => {
      expect(result).toBe(0);
    });
  });

  describe("with a null input", () => {
    beforeEach(() => arrange(null));

    it("should return the expected string", () => {
      expect(result).toBe(0);
    });
  });
});
