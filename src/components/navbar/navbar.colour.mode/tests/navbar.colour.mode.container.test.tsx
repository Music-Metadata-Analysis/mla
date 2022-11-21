import { render } from "@testing-library/react";
import NavBarColorModeToggle from "../navbar.colour.mode.component";
import NavBarColourModeContainer from "../navbar.colour.mode.container";
import { mockColourModeHook } from "@src/clients/ui.framework/__mocks__/vendor.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { ChangeEvent } from "react";

jest.mock("@src/clients/ui.framework/vendor");

jest.mock("../navbar.colour.mode.component", () =>
  require("@fixtures/react/child").createComponent(["NavBarToggle"])
);

describe("NavBarLinkContainer", () => {
  const expectedAnalyticsName = "Colour Mode Toggle";
  const mockChangeEvent = {
    target: { blur: jest.fn() },
    isTrusted: true,
  } as unknown as ChangeEvent<HTMLElement>;
  const mockTracker = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<NavBarColourModeContainer tracker={mockTracker} />);
  };

  const checkNavBarColourModeToggle = () => {
    it("should render the NavBarColorModeToggle with the correct props", () => {
      expect(NavBarColorModeToggle).toBeCalledTimes(1);
      checkMockCall(
        NavBarColorModeToggle,
        {
          colourMode: mockColourModeHook.colourMode,
        },
        0,
        ["handleChange"]
      );
    });
  };

  const checkNavBarColourModeToggleClick = () => {
    describe("when the link click handler function is invoked", () => {
      beforeEach(() => {
        expect(NavBarColorModeToggle).toBeCalledTimes(1);
        const call = jest.mocked(NavBarColorModeToggle).mock.calls[0][0];
        call.handleChange(mockChangeEvent);
      });

      it("should blur focus on the target element", () => {
        expect(mockChangeEvent.target.blur).toBeCalledTimes(1);
        expect(mockChangeEvent.target.blur).toBeCalledWith();
      });

      it("should call the analytics tracker as expected", () => {
        expect(mockTracker).toBeCalledTimes(1);
        expect(mockTracker).toBeCalledWith(
          mockChangeEvent,
          expectedAnalyticsName
        );
      });

      it("should toggle the colour mode", () => {
        expect(mockColourModeHook.toggle).toBeCalledTimes(1);
        expect(mockColourModeHook.toggle).toBeCalledWith();
      });
    });
  };

  describe("when colour mode is 'light'", () => {
    beforeEach(() => {
      mockColourModeHook.colourMode = "light" as const;

      arrange();
    });

    checkNavBarColourModeToggle();
    checkNavBarColourModeToggleClick();
  });

  describe("when colour mode is 'dark'", () => {
    beforeEach(() => {
      mockColourModeHook.colourMode = "dark" as const;

      arrange();
    });

    checkNavBarColourModeToggle();
    checkNavBarColourModeToggleClick();
  });
});
