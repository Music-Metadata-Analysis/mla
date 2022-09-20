import { render } from "@testing-library/react";
import NavBarColorModeToggle from "../navbar.colour.mode.component";
import NavBarColourModeContainer from "../navbar.colour.mode.container";
import mockColourHook from "@src/components/navbar/navbar.hooks/__mocks__/navbar.ui.colour.mode.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { ChangeEvent } from "react";

jest.mock("@src/components/navbar/navbar.hooks/navbar.ui.colour.mode");

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
          colourMode: mockColourHook.colourMode,
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
        expect(mockColourHook.toggle).toBeCalledTimes(1);
        expect(mockColourHook.toggle).toBeCalledWith();
      });
    });
  };

  describe("when colour mode is 'light'", () => {
    beforeEach(() => {
      mockColourHook.colourMode = "light";

      arrange();
    });

    checkNavBarColourModeToggle();
    checkNavBarColourModeToggleClick();
  });

  describe("when colour mode is 'dark'", () => {
    beforeEach(() => {
      mockColourHook.colourMode = "dark";

      arrange();
    });

    checkNavBarColourModeToggle();
    checkNavBarColourModeToggleClick();
  });
});
