import isNextSSR from "../next";

describe("isNextSSR", () => {
  let windowSpy: jest.SpyInstance;
  let result: boolean;

  beforeEach(() => jest.clearAllMocks());

  describe("when running without a window object (SSR environment)", () => {
    beforeEach(() => {
      windowSpy = jest
        .spyOn(global, "window", "get")
        .mockImplementationOnce(() => undefined as unknown as typeof window);
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    describe("when called", () => {
      beforeEach(() => {
        result = isNextSSR();
      });

      it("should return true", () => {
        expect(result).toBe(true);
      });
    });
  });

  describe("when running with a window object (Browser environment)", () => {
    describe("when called", () => {
      beforeEach(() => {
        result = isNextSSR();
      });

      it("should return false", () => {
        expect(result).toBe(false);
      });
    });
  });
});
