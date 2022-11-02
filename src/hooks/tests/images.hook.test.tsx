import { renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/images.mock";
import useImagesController from "../images";
import { ImagesControllerContext } from "@src/providers/controllers/images/images.provider";
import type { ImagesControllerContextInterface } from "@src/types/controllers/images/images.context.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockImageContext: ImagesControllerContextInterface;
}

describe("useImagesController", () => {
  let received: ReturnType<typeof arrange>;

  const mockImagesLoaded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({
    children,
    mockImageContext,
  }: MockInterfaceContextWithChildren) => {
    return (
      <ImagesControllerContext.Provider value={mockImageContext}>
        {children}
      </ImagesControllerContext.Provider>
    );
  };

  const arrange = (providerImageProps: ImagesControllerContextInterface) => {
    return renderHook(() => useImagesController(), {
      wrapper: providerWrapper,
      initialProps: {
        mockImageContext: providerImageProps,
      },
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        loadedCount: 0,
        setLoadedCount: mockImagesLoaded,
      });
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.reset).toBeInstanceOf(Function);
      expect(received.result.current.load).toBeInstanceOf(Function);
    });

    it("should contain an initial count of an expected value", () => {
      expect(received.result.current.count).toBe(0);
    });

    describe("when load is called", () => {
      beforeEach(() => received.result.current.load());

      it("should increment the count", () => {
        expect(mockImagesLoaded).toBeCalledTimes(1);
        const callback = jest.mocked(mockImagesLoaded).mock.calls[0][0];
        expect(callback(1)).toBe(2);
      });
    });

    describe("when reset is called", () => {
      beforeEach(() => received.result.current.reset());

      it("should zero the count", () => {
        expect(mockImagesLoaded).toBeCalledTimes(1);
        expect(mockImagesLoaded).toBeCalledWith(0);
      });
    });
  });
});
