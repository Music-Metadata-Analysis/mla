import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useTranslation } from "next-i18next";
import useNextI18NextVendor from "../next-i18next";
import { mockLocaleVendorHook as mockHookValues } from "@src/vendors/integrations/locale/__mocks__/vendor.mock";
import type { LocaleVendorHookInterface } from "@src/vendors/types/integrations/locale/vendor.types";

jest.mock("next-i18next");

describe("useNextI18NextVendor", () => {
  let received: ReturnType<typeof arrange>;
  let mockNS: string | undefined;
  const mockT = jest.fn(() => mockTranslationResult);
  const mockTranslationInput = "mockTranslationInput";
  const mockTranslationResult = "mockTranslationResult";

  beforeEach(() => {
    jest.clearAllMocks();
    (useTranslation as jest.Mock).mockReturnValueOnce({
      t: mockT,
    });
  });

  const arrange = () => {
    return renderHook(() => useNextI18NextVendor(mockNS));
  };

  const checkHookRender = () => {
    it("should render the vendor's useTranslation hook during render", () => {
      expect(useTranslation).toBeCalledTimes(1);
      expect(useTranslation).toBeCalledWith(mockNS);
    });
  };

  const checkHookProperties = () => {
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
      expect(typeof received.result.current.t).toBe("function");
    });
  };

  describe("with a namespace,", () => {
    beforeEach(() => {
      mockNS = "mockNs";
    });

    describe("when rendered", () => {
      beforeEach(() => {
        received = arrange();
      });

      checkHookRender();
      checkHookProperties();

      describe("t", () => {
        let result: string;

        beforeEach(
          () => (result = received.result.current.t(mockTranslationInput))
        );

        it("should call the underlying vendor hook with the correct namespace", () => {
          expect(mockT).toBeCalledTimes(1);
          expect(mockT).toBeCalledWith(mockTranslationInput);
        });

        it("should return the expected translation value", () => {
          expect(result).toBe(mockTranslationResult);
        });
      });
    });
  });
});
