import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/router.hook.mock";
import useRouter from "../router.hook";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("useRouter", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useRouter());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(
        mockHookValues as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should call the underlying vendor hook during render", () => {
      expect(webFrameworkVendor.routerHook).toHaveBeenCalledTimes(1);
      expect(webFrameworkVendor.routerHook).toHaveBeenCalledWith();
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockHookValues);
    });
  });
});
