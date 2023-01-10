import { renderHook } from "@testing-library/react-hooks";
import mockHookValues from "../__mocks__/popups.generator.hook.mock";
import usePopUpsGenerator from "../popups.generator.hook";
import { createSimpleComponent } from "@fixtures/react/simple";
import { mockPopUpCreatorHook } from "@src/vendors/integrations/ui.framework/__mocks__/vendor.mock";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import type { UIVendorCreatePopUpHookInterface } from "@src/vendors/types/integrations/ui.framework/vendor.types";

jest.mock("@src/vendors/integrations/ui.framework/vendor");

describe("usePopUpsGenerator", () => {
  let received: ReturnType<typeof arrange>;

  const mockPopUpComponent = createSimpleComponent("MockPopUpComponent");

  const mockProps: UIVendorCreatePopUpHookInterface = {
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

    it("should contain all the same properties as the mock hook", () => {
      expect(received.result.current).toBe(mockHookValues);
    });

    it("should call the underlying vendor hook when generating the popup", () => {
      expect(uiFrameworkVendor.popups.creatorHook).toBeCalledTimes(1);
      expect(uiFrameworkVendor.popups.creatorHook).toBeCalledWith(mockProps);
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockPopUpCreatorHook);
    });
  });
});
