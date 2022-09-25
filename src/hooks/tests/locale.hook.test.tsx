import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockUseLocaleHook from "./locale.mock.hook";
import useLocale from "../locale";

jest.mock("@src/clients/locale/vendor", () => ({
  hook: () => mockUseLocaleHook,
}));

describe("useLocale", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockNS = "mockNS";
  const mockTranslationKey = "mockTranslationKey";
  const mockTranslationResult = "mockTranslationResult";

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = () => {
    return renderHook(() => useLocale(mockNS));
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(
        mockUseLocaleHook as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.t).toBe(mockUseLocaleHook.t);
    });

    describe("t", () => {
      let result: string;

      beforeEach(() => {
        (mockUseLocaleHook.t as jest.Mock).mockReturnValueOnce(
          mockTranslationResult
        );

        result = received.result.current.t(mockTranslationKey);
      });

      it("should call the underlying vendor hook", () => {
        expect(mockUseLocaleHook.t).toBeCalledTimes(1);
        expect(mockUseLocaleHook.t).toBeCalledWith(mockTranslationKey);
      });

      it("should return the expected value", () => {
        expect(result).toBe(mockTranslationResult);
      });
    });
  });
});
