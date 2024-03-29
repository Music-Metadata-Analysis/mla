import { act, renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/navbar.controller.hook.mock";
import useNavBarController from "../navbar.controller.hook";
import { createHookWrapper } from "@src/fixtures/mocks/mock.hook.wrapper";
import makeUniqueHookMock from "@src/fixtures/mocks/mock.object.unique";
import NavBarProvider from "@src/web/navigation/navbar/state/providers/navbar.provider";
import mockToggleHook from "@src/web/ui/generics/state/hooks/__mocks__/toggle.hook.mock";
import { checkIsToggle } from "@src/web/ui/generics/state/hooks/tests/fixtures/toggle.hook";
import useToggle from "@src/web/ui/generics/state/hooks/toggle.hook";
import type { ReactNode } from "react";

interface MockInterfaceContextWithChildren {
  children?: ReactNode;
}

jest.mock("@src/web/ui/generics/state/hooks/toggle.hook");

describe("useNavBarController", () => {
  let received: ReturnType<typeof arrange>;

  const mockToggleHooks = [
    makeUniqueHookMock<typeof mockToggleHook>(mockToggleHook),
    makeUniqueHookMock<typeof mockToggleHook>(mockToggleHook),
    makeUniqueHookMock<typeof mockToggleHook>(mockToggleHook),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({ children }: MockInterfaceContextWithChildren) => {
    return <NavBarProvider>{children}</NavBarProvider>;
  };

  const arrange = () => {
    jest
      .mocked(useToggle)
      .mockImplementationOnce(() => mockToggleHooks[0])
      .mockImplementationOnce(() => mockToggleHooks[1])
      .mockImplementationOnce(() => mockToggleHooks[2]);

    return renderHook(() => useNavBarController(), {
      wrapper: createHookWrapper<MockInterfaceContextWithChildren>(
        providerWrapper,
        {}
      ),
    });
  };

  const checkControl = ({
    property,
    toggleFunction,
    mockIndex,
    notCalled,
  }: {
    property: keyof typeof mockHookValues;
    toggleFunction: Exclude<keyof typeof mockToggleHook, "state">;
    mockIndex: number;
    notCalled?: boolean;
  }) => {
    describe(`when '${toggleFunction}' is called on ${property}`, () => {
      beforeEach(async () => {
        received = arrange();

        await act(async () => {
          received.result.current[property][toggleFunction]();
        });
      });

      if (notCalled) {
        it(`should NOT call ${property}'s underlying useToggle method`, () => {
          expect(
            mockToggleHooks[mockIndex][toggleFunction]
          ).toHaveBeenCalledTimes(0);
        });
      } else {
        it(`should call ${property}'s underlying useToggle method`, () => {
          expect(
            mockToggleHooks[mockIndex][toggleFunction]
          ).toHaveBeenCalledTimes(1);
          expect(
            mockToggleHooks[mockIndex][toggleFunction]
          ).toHaveBeenCalledWith();
        });

        it(`should only call ${property}'s underlying useToggle method`, () => {
          mockToggleHooks.forEach((mockFn, index) => {
            if (index !== mockIndex) {
              expect(mockFn[toggleFunction]).toHaveBeenCalledTimes(0);
            }
          });
        });
      }
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    checkIsToggle(() => received.result.current, "hamburger");
    checkIsToggle(() => received.result.current, "mobileMenu");
    checkIsToggle(() => received.result.current, "navigation");
  });

  describe("the hamburger controls", () => {
    checkControl({
      property: "hamburger",
      toggleFunction: "setFalse",
      mockIndex: 0,
    });

    checkControl({
      property: "hamburger",
      toggleFunction: "setTrue",
      mockIndex: 0,
    });

    checkControl({
      property: "hamburger",
      toggleFunction: "toggle",
      mockIndex: 0,
    });
  });

  describe("the mobileMenu controls", () => {
    checkControl({
      property: "mobileMenu",
      toggleFunction: "setFalse",
      mockIndex: 1,
    });

    checkControl({
      property: "mobileMenu",
      toggleFunction: "setTrue",
      mockIndex: 1,
    });

    checkControl({
      property: "mobileMenu",
      toggleFunction: "toggle",
      mockIndex: 1,
    });
  });

  describe("the navBar controls", () => {
    checkControl({
      property: "navigation",
      toggleFunction: "setFalse",
      mockIndex: 2,
    });

    checkControl({
      property: "navigation",
      toggleFunction: "setTrue",
      mockIndex: 2,
    });

    checkControl({
      property: "navigation",
      toggleFunction: "toggle",
      mockIndex: 2,
    });
  });
});
