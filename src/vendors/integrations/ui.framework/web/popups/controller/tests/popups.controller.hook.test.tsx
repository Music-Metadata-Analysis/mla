import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/popups.controller.hook.mock";
import usePopUpsController from "../popups.controller.hook";
import { PopUpsControllerContext } from "@src/vendors/integrations/ui.framework/web/popups/provider/popups.provider";
import type { PopUpsControllerContextInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.context.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockPopupContext: PopUpsControllerContextInterface;
}

describe("usePopUpsController", () => {
  let received: ReturnType<typeof arrange>;
  let errorSpy: jest.SpyInstance;

  const mockPopup = "FeedBack" as const;
  const mockNonExistentPopup = "NonExistent";
  const mockPopUpState = { [mockPopup]: { status: false } };

  const mockPopUpDispatch = jest.fn();

  beforeAll(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => null);
  });

  afterAll(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => null);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    errorSpy.mockClear();
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

    describe("open", () => {
      describe("when open is called on a existent pop-up", () => {
        beforeEach(() => received.result.current.open(mockPopup));

        it("should set the state to open", () => {
          expect(mockPopUpDispatch).toBeCalledTimes(1);
          expect(mockPopUpDispatch).toBeCalledWith({
            name: "FeedBack",
            type: "ShowPopUp",
          });
        });

        it("should NOT log an error", () => {
          expect(errorSpy).toBeCalledTimes(0);
        });
      });

      describe("when called on a non-existent pop-up", () => {
        beforeEach(() => received.result.current.open(mockNonExistentPopup));

        it("should NOT change the state", () => {
          expect(mockPopUpDispatch).toBeCalledTimes(0);
        });

        it("should log an error", () => {
          expect(errorSpy).toBeCalledTimes(1);
          expect(errorSpy).toBeCalledWith(
            `ERROR: Reference to non-existent PopUp: '${mockNonExistentPopup}'`
          );
        });
      });
    });

    describe("status", () => {
      describe("when called on an existent pop-up", () => {
        let result: boolean | null;

        beforeEach(() => (result = received.result.current.status(mockPopup)));

        it("should return the state value", () => {
          expect(result).toBe(false);
        });

        it("should NOT log an error", () => {
          expect(errorSpy).toBeCalledTimes(0);
        });
      });

      describe("when called on a non-existent pop-up", () => {
        let result: boolean | null;

        beforeEach(
          () => (result = received.result.current.status(mockNonExistentPopup))
        );

        it("should return false", () => {
          expect(result).toBe(false);
        });

        it("should log an error", () => {
          expect(errorSpy).toBeCalledTimes(1);
          expect(errorSpy).toBeCalledWith(
            `ERROR: Reference to non-existent PopUp: '${mockNonExistentPopup}'`
          );
        });
      });
    });
  });
});
