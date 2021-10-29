import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockUserInterfaceHook from "./ui.mock.hook";
import { UserInterfaceImagesContext } from "../../providers/ui/ui.images/ui.images.provider";
import { UserInterfacePopUpsContext } from "../../providers/ui/ui.popups/ui.popups.provider";
import useUserInterface from "../ui";
import type { UserInterfaceImagesContextInterface } from "../../types/ui/images/ui.images.context.types";
import type { UserInterfacePopUpsContextInterface } from "../../types/ui/popups/ui.popups.context.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockPopupContext: UserInterfacePopUpsContextInterface;
  mockImageContext: UserInterfaceImagesContextInterface;
}

describe("useUserInterface", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockImagesLoaded = jest.fn();
  const mockPopUpDispatch = jest.fn();
  const mockPopup = "FeedBack" as const;

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const providerWrapper = ({
    children,
    mockPopupContext,
    mockImageContext,
  }: MockInterfaceContextWithChildren) => {
    return (
      <UserInterfaceImagesContext.Provider value={mockImageContext}>
        <UserInterfacePopUpsContext.Provider value={mockPopupContext}>
          {children}
        </UserInterfacePopUpsContext.Provider>
      </UserInterfaceImagesContext.Provider>
    );
  };

  const arrange = (
    providerPopupProps: UserInterfacePopUpsContextInterface,
    providerImageProps: UserInterfaceImagesContextInterface
  ) => {
    return renderHook(() => useUserInterface(), {
      wrapper: providerWrapper,
      initialProps: {
        mockImageContext: providerImageProps,
        mockPopupContext: providerPopupProps,
      },
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange(
        {
          status: { [mockPopup]: { status: false } },
          dispatch: mockPopUpDispatch,
        },
        {
          loadedCount: 0,
          setLoadedCount: mockImagesLoaded,
        }
      );
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockUserInterfaceHook).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    describe("within the pop-ups management component", () => {
      it("should contain the correct functions", () => {
        expect(received.result.current.popups.close).toBeInstanceOf(Function);
        expect(received.result.current.popups.open).toBeInstanceOf(Function);
        expect(received.result.current.popups.status).toBeInstanceOf(Function);
      });

      describe("when close is called on a pop-up", () => {
        beforeEach(() => received.result.current.popups.close(mockPopup));

        it("should set the state to closed", () => {
          expect(mockPopUpDispatch).toBeCalledTimes(1);
          expect(mockPopUpDispatch).toBeCalledWith({
            name: "FeedBack",
            type: "HidePopUp",
          });
        });
      });

      describe("when open is called on a pop-up", () => {
        beforeEach(() => received.result.current.popups.open(mockPopup));

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

        beforeEach(
          () => (result = received.result.current.popups.status(mockPopup))
        );

        it("should return the state value", () => {
          expect(result).toBe(false);
        });
      });
    });

    describe("within the images management component", () => {
      it("should contain the correct functions", () => {
        expect(received.result.current.images.reset).toBeInstanceOf(Function);
        expect(received.result.current.images.load).toBeInstanceOf(Function);
      });

      it("should contain an initial count of an expected value", () => {
        expect(received.result.current.images.count).toBe(0);
      });

      describe("when load is called", () => {
        beforeEach(() => received.result.current.images.load());

        it("should increment the count", () => {
          expect(mockImagesLoaded).toBeCalledTimes(1);
          const callback = (mockImagesLoaded as jest.Mock).mock.calls[0][0];
          expect(callback(1)).toBe(2);
        });
      });

      describe("when reset is called", () => {
        beforeEach(() => received.result.current.images.reset());

        it("should zero the count", () => {
          expect(mockImagesLoaded).toBeCalledTimes(1);
          expect(mockImagesLoaded).toBeCalledWith(0);
        });
      });
    });
  });
});
