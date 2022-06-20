import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import mockUseNavBar from "./navbar.mock.hook";
import NavConfig from "../../config/navbar";
import NavBarProvider from "../../providers/navbar/navbar.provider";
import useNavBar from "../navbar";
import type { NavBarContextInterface } from "../../types/navbar.types";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
  mockContext: NavBarContextInterface;
}

describe("useNavBar", () => {
  let originalEnvironment: typeof process.env;
  let received: ReturnType<typeof arrange>;

  beforeAll(() => {
    originalEnvironment = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const providerWrapper = ({ children }: MockInterfaceContextWithChildren) => {
    return <NavBarProvider>{children}</NavBarProvider>;
  };

  const arrange = () => {
    return renderHook(() => useNavBar(), { wrapper: providerWrapper });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain the correct setter functions", () => {
      expect(received.result.current.setters.hideNavBar).toBeInstanceOf(
        Function
      );
      expect(received.result.current.setters.showNavBar).toBeInstanceOf(
        Function
      );
      expect(received.result.current.setters.disableHamburger).toBeInstanceOf(
        Function
      );
      expect(received.result.current.setters.enableHamburger).toBeInstanceOf(
        Function
      );
    });

    it("should contain the correct getters values", () => {
      expect(received.result.current.getters.isHamburgerEnabled).toBe(true);
      expect(received.result.current.getters.isVisible).toBe(true);
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockUseNavBar).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });
  });

  const checkHamburgerControls = () => {
    describe("when disableHamburger is called", () => {
      beforeEach(
        async () =>
          await act(async () => {
            received.result.current.setters.disableHamburger();
          })
      );

      it("should update the correct hook value", () => {
        expect(received.result.current.getters.isHamburgerEnabled).toBe(false);
      });

      describe("when enableHamburger is called", () => {
        beforeEach(
          async () =>
            await act(async () => {
              received.result.current.setters.enableHamburger();
            })
        );

        it("should update the correct hook value", () => {
          expect(received.result.current.getters.isHamburgerEnabled).toBe(true);
        });
      });
    });
  };

  describe("when on a larger screen", () => {
    beforeEach(() => {
      global.innerHeight = NavConfig.minimumHeightDuringInput;
      received = arrange();
    });

    describe("when hideNavBar is called", () => {
      beforeEach(
        async () =>
          await act(async () => {
            received.result.current.setters.hideNavBar();
          })
      );

      it("should not hide the navbar as expected", () => {
        expect(received.result.current.getters.isVisible).toBe(true);
      });

      describe("when showNavBar is called", () => {
        beforeEach(
          async () =>
            await act(async () => {
              received.result.current.setters.showNavBar();
            })
        );

        it("should show the navbar as expected", () => {
          expect(received.result.current.getters.isVisible).toBe(true);
        });
      });
    });

    checkHamburgerControls();
  });

  describe("when on a smaller screen", () => {
    beforeEach(() => {
      global.innerHeight = NavConfig.minimumHeightDuringInput - 1;
      received = arrange();
    });

    describe("when hideNavBar is called", () => {
      beforeEach(
        async () =>
          await act(async () => {
            received.result.current.setters.hideNavBar();
          })
      );

      it("should hide the navbar as expected", () => {
        expect(received.result.current.getters.isVisible).toBe(false);
      });

      describe("when showNavBar is called", () => {
        beforeEach(
          async () =>
            await act(async () => {
              received.result.current.setters.showNavBar();
            })
        );

        it("should show the navbar as expected", () => {
          expect(received.result.current.getters.isVisible).toBe(true);
        });
      });
    });

    checkHamburgerControls();
  });
});
