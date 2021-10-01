import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import NavConfig from "../../config/navbar";
import { NavBarContext } from "../../providers/navbar/navbar.provider";
import useNavBar from "../navbar";
import type { NavBarContextInterface } from "../../types/navbar.types";

interface MockInterfaceContextWithChildren {
  children?: React.ReactNode;
  mockContext: NavBarContextInterface;
}

describe("useNavBar", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;
  const mockSetIsVisible = jest.fn();

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
      <NavBarContext.Provider value={mockContext}>
        {children}
      </NavBarContext.Provider>
    );
  };

  const arrange = (providerProps: NavBarContextInterface) => {
    return renderHook(() => useNavBar(), {
      wrapper: providerWrapper,
      initialProps: {
        mockContext: providerProps,
      },
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange({
        isVisible: true,
        setIsVisible: mockSetIsVisible,
      });
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.hideNavBar).toBeInstanceOf(Function);
      expect(received.result.current.showNavBar).toBeInstanceOf(Function);
    });
  });

  describe("when on a larger screen", () => {
    beforeAll(() => {
      global.innerHeight = NavConfig.heightDuringInput;
      received = arrange({
        isVisible: true,
        setIsVisible: mockSetIsVisible,
      });
    });

    describe("when hideNavBar is called", () => {
      beforeEach(() => received.result.current.hideNavBar());

      it("should not hide the navbar as expected", () => {
        expect(mockSetIsVisible).toBeCalledTimes(1);
        expect(mockSetIsVisible).toBeCalledWith(true);
      });
    });

    describe("when showNavBar is called", () => {
      beforeEach(() => received.result.current.showNavBar());

      it("should show the navbar as expected", () => {
        expect(mockSetIsVisible).toBeCalledTimes(1);
        expect(mockSetIsVisible).toBeCalledWith(true);
      });
    });
  });

  describe("when on a smaller screen", () => {
    beforeAll(() => {
      global.innerHeight = NavConfig.heightDuringInput - 1;
      received = arrange({
        isVisible: true,
        setIsVisible: mockSetIsVisible,
      });
    });

    describe("when hideNavBar is called", () => {
      beforeEach(() => received.result.current.hideNavBar());

      it("should hide the navbar as expected", () => {
        expect(mockSetIsVisible).toBeCalledTimes(1);
        expect(mockSetIsVisible).toBeCalledWith(false);
      });
    });

    describe("when showNavBar is called", () => {
      beforeEach(() => received.result.current.showNavBar());

      it("should show the navbar as expected", () => {
        expect(mockSetIsVisible).toBeCalledTimes(1);
        expect(mockSetIsVisible).toBeCalledWith(true);
      });
    });
  });
});
