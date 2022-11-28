import { renderHook } from "@testing-library/react-hooks";
import mockHookValues from "../__mocks__/popups.generator.hook.mock";
import usePopUpsGenerator from "../popups.generator.hook";
import { createSimpleComponent } from "@fixtures/react/simple";
import uiFrameworkVendor from "@src/clients/ui.framework/vendor";
import type { VendorCreatePopUpHookProps } from "@src/types/clients/ui.framework/vendor.types";

jest.mock("@src/clients/ui.framework/vendor");

describe("usePopUpsGenerator", () => {
  let received: ReturnType<typeof arrange>;

  const mockPopUpComponent = createSimpleComponent("MockPopUpComponent");

  const mockProps: VendorCreatePopUpHookProps = {
    name: "FeedBack",
    message: "mockMessage",
    component: mockPopUpComponent,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => usePopUpsGenerator(mockProps));
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should return null", () => {
      expect(received.result.current).toBeNull();
    });

    it("should call the underlying vendor hook when generating the popup", () => {
      expect(uiFrameworkVendor.createPopUpHook).toBeCalledTimes(1);
      expect(uiFrameworkVendor.createPopUpHook).toBeCalledWith(mockProps);
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockHookValues);
    });
  });
});
