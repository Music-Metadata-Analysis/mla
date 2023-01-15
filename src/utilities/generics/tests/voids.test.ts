import { voidFn, normalizeNull, normalizeUndefined } from "../voids";

describe("voidFn", () => {
  it("should return a null", () => {
    expect(voidFn()).toBeNull();
  });
});

describe("normalizeNull", () => {
  let value: string | undefined | null;
  let result: string | undefined | null;
  const fn = normalizeNull;

  const actCallFn = () => (result = fn(value));

  describe("when called with a string", () => {
    beforeEach(() => (value = "string"));

    it("should return the string", () => {
      actCallFn();

      expect(result).toBe(value);
    });
  });

  describe("when called with a null", () => {
    beforeEach(() => (value = null));

    it("should return null", () => {
      actCallFn();

      expect(result).toBeNull();
    });
  });

  describe("when called with an undefined value", () => {
    beforeEach(() => (value = undefined));

    it("should return null", () => {
      actCallFn();

      expect(result).toBeNull();
    });
  });
});

describe("normalizeUndefined", () => {
  let value: string | undefined | null;
  let result: string | undefined | null;
  const fn = normalizeUndefined;

  const actCallFn = () => (result = fn(value));

  describe("when called with a string", () => {
    beforeEach(() => (value = "string"));

    it("should return the string", () => {
      actCallFn();

      expect(result).toBe(value);
    });
  });

  describe("when called with a null", () => {
    beforeEach(() => (value = null));

    it("should return undefined", () => {
      actCallFn();

      expect(result).toBeUndefined();
    });
  });

  describe("when called with an undefined value", () => {
    beforeEach(() => (value = undefined));

    it("should return undefined", () => {
      actCallFn();

      expect(result).toBeUndefined();
    });
  });
});
