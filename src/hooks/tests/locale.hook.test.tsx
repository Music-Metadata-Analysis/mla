import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/locale.mock";
import useLocale from "../locale";
import localeVendor from "@src/clients/locale/vendor";
import type { LocaleVendorHookInterface } from "@src/types/clients/locale/vendor.types";

jest.mock("@src/clients/locale/vendor");

describe("useLocale", () => {
  let received: ReturnType<typeof arrange>;
  const mockNS = "mockNS";
  const mockTranslationKey = "mockTranslationKey";
  const mockTranslationResult = "mockTranslationResult";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useLocale(mockNS));
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should call the underlying vendor hook during render", () => {
      expect(localeVendor.hook).toBeCalledTimes(1);
      expect(localeVendor.hook).toBeCalledWith(mockNS);
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

      it("should call the underlying vendor hook's t function", () => {
        expect(mockHookValues.t).toBeCalledTimes(1);
        expect(mockHookValues.t).toBeCalledWith(mockTranslationKey);
      });

      it("should return the expected value", () => {
        expect(result).toBe(mockTranslationResult);
      });
    });
  });
});
