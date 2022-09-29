import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/locale.mock";
import useLocale from "../locale";
import type { LocaleVendorHookInterface } from "@src/types/clients/locale/vendor.types";

jest.mock("@src/clients/locale/vendor");

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
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(
        received.result.current as Record<
          keyof LocaleVendorHookInterface,
          unknown
        >
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.t).toBe(mockHookValues.t);
    });

    describe("t", () => {
      let result: string;

      beforeEach(() => {
        jest
          .mocked(mockHookValues.t)
          .mockReturnValueOnce(mockTranslationResult);

        result = received.result.current.t(mockTranslationKey);
      });

      it("should call the underlying vendor hook", () => {
        expect(mockHookValues.t).toBeCalledTimes(1);
        expect(mockHookValues.t).toBeCalledWith(mockTranslationKey);
      });

      it("should return the expected value", () => {
        expect(result).toBe(mockTranslationResult);
      });
    });
  });
});
