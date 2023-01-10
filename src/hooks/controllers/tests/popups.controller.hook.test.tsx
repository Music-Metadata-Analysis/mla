import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/popups.controller.hook.mock";
import usePopUpsController from "../popups.controller.hook";
import { mockPopUpControllerHook } from "@src/vendors/integrations/ui.framework/__mocks__/vendor.mock";
import { PopUpsControllerContext } from "@src/vendors/integrations/ui.framework/popups/provider/popups.provider";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import type { PopUpsControllerContextInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.context.types";
import type { ReactNode } from "react";

jest.mock("@src/vendors/integrations/ui.framework/vendor");

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockPopupContext: PopUpsControllerContextInterface;
}

describe("usePopUpsController", () => {
  let received: ReturnType<typeof arrange>;

  const mockPopup = "FeedBack" as const;
  const mockPopUpState = { [mockPopup]: { status: false } };

  const mockPopUpDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({
    children,
    mockPopupContext,
  }: MockInterfaceContextWithChildren) => {
    return (
      <PopUpsControllerContext.Provider value={mockPopupContext}>
        {children}
      </PopUpsControllerContext.Provider>
    );
  };

  const arrange = (providerPopupProps: PopUpsControllerContextInterface) => {
    return renderHook(() => usePopUpsController(), {
      wrapper: providerWrapper,
      initialProps: {
        mockPopupContext: providerPopupProps,
      },
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        state: mockPopUpState,
        dispatch: mockPopUpDispatch,
      });
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.open).toBe("function");
      expect(typeof received.result.current.status).toBe("function");
    });

    it("should call the underlying vendor hook when generating the popup", () => {
      expect(uiFrameworkVendor.popups.controllerHook).toBeCalledTimes(1);
      expect(uiFrameworkVendor.popups.controllerHook).toBeCalledWith();
    });

    it("should return the vendor hook", () => {
      expect(received.result.current).toBe(mockPopUpControllerHook);
    });
  });
});
