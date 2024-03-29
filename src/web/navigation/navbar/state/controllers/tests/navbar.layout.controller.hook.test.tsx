import { act, fireEvent } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/navbar.layout.controller.hook.mock";
import useNavBarLayoutController from "../navbar.layout.controller.hook";
import type mockToggleHookValues from "@src/web/ui/generics/state/hooks/__mocks__/toggle.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock(
  "@src/web/navigation/navbar/state/controllers/navbar.controller.hook"
);

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(() => mockRootReference),
}));

const mockRootReference: { current: { clientHeight: number } | null } =
  mockHookValues.rootReference;

describe("useNavBarController", () => {
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return renderHook(() => useNavBarLayoutController());
  };

  const checkControlProperties = (
    name: keyof typeof mockHookValues.controls
  ) => {
    it(`should contain a ${name} control, with the functions of a toggle hook`, () => {
      expect(typeof received.result.current.controls[name].setFalse).toBe(
        "function"
      );
      expect(typeof received.result.current.controls[name].setTrue).toBe(
        "function"
      );
      expect(typeof received.result.current.controls[name].toggle).toBe(
        "function"
      );
    });

    it(`should contain a ${name} control, with the state boolean of a toggle hook`, () => {
      expect(typeof received.result.current.controls[name].state).toBe(
        "boolean"
      );
    });
  };

  const checkControlFunctions = ({
    property,
    toggleFunction,
  }: {
    property: keyof typeof mockHookValues.controls;
    toggleFunction: Exclude<keyof typeof mockToggleHookValues, "state">;
  }) => {
    describe(`when '${toggleFunction}' is called on ${property}`, () => {
      beforeEach(async () => {
        received = arrange();

        await act(async () => {
          received.result.current.controls[property][toggleFunction]();
        });
      });

      it(`should call ${property}'s underlying useToggle method`, () => {
        expect(
          mockHookValues.controls[property][toggleFunction]
        ).toHaveBeenCalledTimes(1);
        expect(
          mockHookValues.controls[property][toggleFunction]
        ).toHaveBeenCalledWith();
      });

      it(`should only call ${property}'s underlying useToggle method`, () => {
        (
          Object.keys(mockHookValues.controls) as Array<
            keyof typeof mockHookValues.controls
          >
        ).forEach((controlName) => {
          if (controlName !== property) {
            expect(
              mockHookValues.controls[controlName][toggleFunction]
            ).toHaveBeenCalledTimes(0);
          }
        });
      });
    });
  };

  describe("when rendered", () => {
    beforeEach(() => {
      received = arrange();
    });

    it("should contain all the same property names as the mock hook", () => {
      const mockObjectKeys = dk(
        mockHookValues as unknown as Record<string, unknown>
      ).sort();
      const hookKeys = dk(
        received.result.current as unknown as Record<string, unknown>
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    checkControlProperties("hamburger");
    checkControlProperties("mobileMenu");
    checkControlProperties("navigation");

    it("should contain the correct root reference", () => {
      expect(received.result.current.rootReference).toBe(
        mockHookValues.rootReference
      );
    });

    checkControlFunctions({
      property: "hamburger",
      toggleFunction: "setFalse",
    });
    checkControlFunctions({
      property: "hamburger",
      toggleFunction: "setTrue",
    });
    checkControlFunctions({
      property: "hamburger",
      toggleFunction: "toggle",
    });

    checkControlFunctions({
      property: "mobileMenu",
      toggleFunction: "setFalse",
    });
    checkControlFunctions({
      property: "mobileMenu",
      toggleFunction: "setTrue",
    });
    checkControlFunctions({
      property: "mobileMenu",
      toggleFunction: "toggle",
    });

    checkControlFunctions({
      property: "navigation",
      toggleFunction: "setFalse",
    });
    checkControlFunctions({
      property: "navigation",
      toggleFunction: "setTrue",
    });
    checkControlFunctions({
      property: "navigation",
      toggleFunction: "toggle",
    });
  });

  describe("when the reference is defined", () => {
    beforeEach(() => (mockRootReference.current = { clientHeight: 100 }));

    describe("when clicking on the document", () => {
      describe("when the document is clicked above the defined threshold", () => {
        beforeEach(() => {
          received = arrange();

          fireEvent(
            window.document,
            new MouseEvent("click", {
              clientY:
                (
                  mockRootReference.current as NonNullable<
                    typeof mockRootReference.current
                  >
                ).clientHeight + 1,
            })
          );
        });

        it("should close the mobile menu", () => {
          expect(
            received.result.current.controls.mobileMenu.setFalse
          ).toHaveBeenCalledTimes(1);
          expect(
            received.result.current.controls.mobileMenu.setFalse
          ).toHaveBeenCalledWith();
        });

        describe("when the hook is unmounted", () => {
          beforeEach(() => {
            mockHookValues.controls.mobileMenu.setFalse.mockClear();
            received.unmount();
          });

          describe("when the document is clicked above the defined threshold again", () => {
            beforeEach(() => {
              fireEvent(
                window.document,
                new MouseEvent("click", {
                  clientY:
                    (
                      mockRootReference.current as NonNullable<
                        typeof mockRootReference.current
                      >
                    ).clientHeight + 1,
                })
              );
            });

            it("should NOT attempt to close the mobile menu again", () => {
              expect(
                received.result.current.controls.mobileMenu.setFalse
              ).toHaveBeenCalledTimes(0);
            });
          });
        });
      });

      describe("when the document is clicked below or equal to the defined threshold", () => {
        beforeEach(() => {
          received = arrange();

          fireEvent(
            window.document,
            new MouseEvent("click", {
              clientY: (
                mockRootReference.current as NonNullable<
                  typeof mockRootReference.current
                >
              ).clientHeight,
            })
          );
        });

        it("should NOT attempt to close the mobile menu", () => {
          expect(
            received.result.current.controls.mobileMenu.setFalse
          ).toHaveBeenCalledTimes(0);
        });
      });
    });
  });

  describe("when the reference is not defined", () => {
    beforeEach(() => (mockRootReference.current = null));

    describe("when clicking on the document", () => {
      describe("when the document is clicked above the defined threshold", () => {
        beforeEach(() => {
          received = arrange();

          fireEvent(
            window.document,
            new MouseEvent("click", {
              clientY: 1,
            })
          );
        });

        it("should NOT close the mobile menu", () => {
          expect(
            received.result.current.controls.mobileMenu.setFalse
          ).toHaveBeenCalledTimes(0);
        });

        describe("when the hook is unmounted", () => {
          beforeEach(() => {
            mockHookValues.controls.mobileMenu.setFalse.mockClear();
            received.unmount();
          });

          describe("when the document is clicked above the defined threshold again", () => {
            beforeEach(() => {
              fireEvent(
                window.document,
                new MouseEvent("click", {
                  clientY: 1,
                })
              );
            });

            it("should NOT attempt to close the mobile menu", () => {
              expect(
                received.result.current.controls.mobileMenu.setFalse
              ).toHaveBeenCalledTimes(0);
            });
          });
        });
      });

      describe("when the document is clicked below or equal to the defined threshold", () => {
        beforeEach(() => {
          received = arrange();

          fireEvent(
            window.document,
            new MouseEvent("click", {
              clientY: 0,
            })
          );
        });

        it("should NOT attempt to close the mobile menu", () => {
          expect(
            received.result.current.controls.mobileMenu.setFalse
          ).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
