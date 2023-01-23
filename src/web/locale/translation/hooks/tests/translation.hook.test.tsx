import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/translation.hook.mock";
import useTranslation from "../translation.hook";
import { localeVendor } from "@src/vendors/integrations/locale/vendor";

jest.mock("@src/vendors/integrations/locale/vendor");

describe("useTranslation", () => {
  let received: ReturnType<typeof arrange>;

  const mockNS = "mockNS";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useTranslation(mockNS));
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should call the underlying vendor hook during render", () => {
      expect(localeVendor.hook).toBeCalledTimes(1);
      expect(localeVendor.hook).toBeCalledWith(mockNS);
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockHookValues);
    });
  });
});
