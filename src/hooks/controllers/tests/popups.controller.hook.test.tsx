import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/popups.controller.hook.mock";
import usePopUpsController from "../popups.controller.hook";
import { PopUpsControllerContext } from "@src/providers/controllers/popups/popups.provider";
import type { PopUpsControllerContextInterface } from "@src/types/controllers/popups/popups.context.types";
import type { ReactNode } from "react";

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
      expect(received.result.current.open).toBeInstanceOf(Function);
      expect(received.result.current.status).toBeInstanceOf(Function);
    });

    describe("when open is called on a pop-up", () => {
      beforeEach(() => received.result.current.open(mockPopup));

      it("should set the state to open", () => {
        expect(mockPopUpDispatch).toBeCalledTimes(1);
        expect(mockPopUpDispatch).toBeCalledWith({
          name: "FeedBack",
          type: "ShowPopUp",
        });
      });
    });

    describe("when status is called on a pop-up", () => {
      let result: boolean | null;

      beforeEach(() => (result = received.result.current.status(mockPopup)));

      it("should return the state value", () => {
        expect(result).toBe(false);
      });
    });
  });
});
