import { Box } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import VerticalScrollBar, {
  VerticalScrollBarProps,
} from "../vertical.scrollbar.component";
import { testIDs } from "../vertical.scrollbar.identifiers";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockColourHook from "@src/hooks/ui/__mocks__/colour.hook.mock";

jest.mock("@src/hooks/ui/colour.hook");

jest.mock("@chakra-ui/react", () =>
  require("@fixtures/chakra").createChakraMock(["Box"])
);

describe("VerticalScrollBarComponent", () => {
  let currentProps: VerticalScrollBarProps;

  const baseProps: VerticalScrollBarProps = {
    ariaControls: "mockAriaControls",
    ariaValuemax: 200,
    ariaValuemin: 0,
    ariaValuenow: 100,
    mouseDownHandler: jest.fn(),
    thumbHeight: "10px",
    thumbOffsetTop: "20px",
    trackHeight: "100px",
    trackOffsetRight: "5px",
    trackOffsetTop: "3px",
    zIndex: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<VerticalScrollBar {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  const checkScrollBarTrackProps = () => {
    it("should call the ScrollBarTrack Box component correctly", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          "aria-controls": currentProps.ariaControls,
          "aria-orientation": "vertical",
          "aria-valuemax": currentProps.ariaValuemax,
          "aria-valuemin": currentProps.ariaValuemin,
          "aria-valuenow": currentProps.ariaValuenow,
          background: mockColourHook.componentColour.background,
          borderColor: mockColourHook.componentColour.foreground,
          borderRadius: "25px",
          borderWidth: 1,
          "data-testid": testIDs.ScrollBarTrack,
          h: currentProps.trackHeight,
          mt: 1,
          onMouseDown: currentProps.mouseDownHandler,
          position: "absolute",
          top: currentProps.trackOffsetTop,
          right: currentProps.trackOffsetRight,
          role: "scrollbar",
          w: "5px",
          zIndex: currentProps.zIndex,
        },
        0,
        []
      );
    });
  };

  const checkScrollBarThumbProps = () => {
    it("should call the ScrollBarThumb Box component correctly", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          background: mockColourHook.componentColour.foreground,
          borderRadius: "25px",
          "data-testid": testIDs.ScrollBarThumb,
          h: currentProps.thumbHeight,
          position: "absolute",
          right: "-1px",
          top: currentProps.thumbOffsetTop,
          mt: 1,
          w: "5px",
        },
        1,
        []
      );
    });
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    checkScrollBarTrackProps();
    checkScrollBarThumbProps();
  });
});
