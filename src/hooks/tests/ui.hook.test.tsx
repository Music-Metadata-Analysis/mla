import { renderHook } from "@testing-library/react-hooks";
import { UserInterfaceImagesContext } from "../../providers/ui/ui.images/ui.images.provider";
import useUserInterface from "../ui";
import type { UserInterfaceImagesContextInterface } from "../../types/ui.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockContext: UserInterfaceImagesContextInterface;
}

describe("useNavBar", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockLoaded = jest.fn();

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
    mockContext,
  }: MockInterfaceContextWithChildren) => {
    return (
      <UserInterfaceImagesContext.Provider value={mockContext}>
        {children}
      </UserInterfaceImagesContext.Provider>
    );
  };

  const arrange = (providerProps: UserInterfaceImagesContextInterface) => {
    return renderHook(() => useUserInterface(), {
      wrapper: providerWrapper,
      initialProps: {
        mockContext: providerProps,
      },
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        loadedCount: 0,
        setLoadedCount: mockLoaded,
      });
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.reset).toBeInstanceOf(Function);
      expect(received.result.current.load).toBeInstanceOf(Function);
    });

    it("the initial count should be as expected", () => {
      expect(received.result.current.count).toBe(0);
    });

    describe("when load is called", () => {
      beforeEach(() => received.result.current.load());

      it("should increment the count", () => {
        expect(mockLoaded).toBeCalledTimes(1);
        const callback = (mockLoaded as jest.Mock).mock.calls[0][0];
        expect(callback(1)).toBe(2);
      });
    });

    describe("when reset is called", () => {
      beforeEach(() => received.result.current.reset());

      it("should zero the count", () => {
        expect(mockLoaded).toBeCalledTimes(1);
        expect(mockLoaded).toBeCalledWith(0);
      });
    });
  });
});
