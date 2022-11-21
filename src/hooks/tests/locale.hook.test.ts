import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/locale.mock";
import useLocale from "../locale";
import localeVendor from "@src/clients/locale/vendor";

jest.mock("@src/clients/locale/vendor");

describe("useLocale", () => {
  let received: ReturnType<typeof arrange>;

  const mockNS = "mockNS";

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