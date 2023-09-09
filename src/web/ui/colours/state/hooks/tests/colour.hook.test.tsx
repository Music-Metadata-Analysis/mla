import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/colour.hook.mock";
import useColour from "../colour.hook";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";

jest.mock("@src/vendors/integrations/ui.framework/vendor");

describe("useColour", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useColour());
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock colour hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should call the underlying vendor hook during render", () => {
      expect(uiFrameworkVendor.core.colourHook).toBeCalledTimes(1);
      expect(uiFrameworkVendor.core.colourHook).toBeCalledWith();
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockHookValues);
    });
  });
});
