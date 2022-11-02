import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/popups.mock";
import usePopUps from "../popups";
import { PopUpsControllerContext } from "@src/providers/controllers/popups/popups.provider";
import type { PopUpsControllerContextInterface } from "@src/types/controllers/popups/popups.context.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockPopupContext: PopUpsControllerContextInterface;
}

describe("usePopUps", () => {
  let received: ReturnType<typeof arrange>;

  const mockPopUpDispatch = jest.fn();
  const mockPopup = "FeedBack" as const;

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
    return renderHook(() => usePopUps(), {
      wrapper: providerWrapper,
      initialProps: {
        mockPopupContext: providerPopupProps,
      },
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        status: { [mockPopup]: { status: false } },
        dispatch: mockPopUpDispatch,
      });
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.close).toBeInstanceOf(Function);
      expect(received.result.current.open).toBeInstanceOf(Function);
      expect(received.result.current.status).toBeInstanceOf(Function);
    });

    describe("when close is called on a pop-up", () => {
      beforeEach(() => received.result.current.close(mockPopup));

      it("should set the state to closed", () => {
        expect(mockPopUpDispatch).toBeCalledTimes(1);
        expect(mockPopUpDispatch).toBeCalledWith({
          name: "FeedBack",
          type: "HidePopUp",
        });
      });
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
