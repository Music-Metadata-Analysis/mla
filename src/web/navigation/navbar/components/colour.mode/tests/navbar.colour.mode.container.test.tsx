import { render } from "@testing-library/react";
import NavBarColorModeToggle from "../navbar.colour.mode.component";
import NavBarColourModeContainer from "../navbar.colour.mode.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockUseColourMode from "@src/web/ui/colours/state/hooks/__mocks__/colour.mode.hook.mock";
import type { ChangeEvent } from "react";

jest.mock("@src/web/ui/colours/state/hooks/colour.mode.hook");

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
      expect(NavBarColorModeToggle).toHaveBeenCalledTimes(1);
      checkMockCall(
        NavBarColorModeToggle,
        {
          colourMode: mockUseColourMode.colourMode,
        },
        0,
        ["handleChange"]
      );
    });
  };

  const checkNavBarColourModeToggleClick = () => {
    describe("when the link click handler function is invoked", () => {
      beforeEach(() => {
        expect(NavBarColorModeToggle).toHaveBeenCalledTimes(1);
        const call = jest.mocked(NavBarColorModeToggle).mock.calls[0][0];
        call.handleChange(mockChangeEvent);
      });

      it("should blur focus on the target element", () => {
        expect(mockChangeEvent.target.blur).toHaveBeenCalledTimes(1);
        expect(mockChangeEvent.target.blur).toHaveBeenCalledWith();
      });

      it("should call the analytics tracker as expected", () => {
        expect(mockTracker).toHaveBeenCalledTimes(1);
        expect(mockTracker).toHaveBeenCalledWith(
          mockChangeEvent,
          expectedAnalyticsName
        );
      });

      it("should toggle the colour mode", () => {
        expect(mockUseColourMode.toggle).toHaveBeenCalledTimes(1);
        expect(mockUseColourMode.toggle).toHaveBeenCalledWith();
      });
    });
  };

  describe("when colour mode is 'light'", () => {
    beforeEach(() => {
      mockUseColourMode.colourMode = "light" as const;

      arrange();
    });

    checkNavBarColourModeToggle();
    checkNavBarColourModeToggleClick();
  });

  describe("when colour mode is 'dark'", () => {
    beforeEach(() => {
      mockUseColourMode.colourMode = "dark" as const;

      arrange();
    });

    checkNavBarColourModeToggle();
    checkNavBarColourModeToggleClick();
  });
});
