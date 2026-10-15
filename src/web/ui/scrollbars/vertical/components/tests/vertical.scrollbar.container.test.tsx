import { render } from "@testing-library/react";
import VerticalScrollBar from "../vertical.scrollbar.component";
import VerticalScrollBarContainer from "../vertical.scrollbar.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockUseVerticalScrollBarEventsController from "@src/web/ui/scrollbars/vertical/state/controllers/__mocks__/vertical.scrollbar.events.controller.hook.mock";
import mockUseVerticalScrollBarLayoutController from "@src/web/ui/scrollbars/vertical/state/controllers/__mocks__/vertical.scrollbar.layout.controller.hook.mock";
import useVerticalScrollBarEventsController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.events.controller.hook";
import useVerticalScrollLayoutController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.layout.controller.hook";
import type { VerticalScrollBarContainerProps } from "../vertical.scrollbar.container";

jest.mock(
  "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.events.controller.hook"
);

jest.mock(
  "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.layout.controller.hook"
);

jest.mock("../vertical.scrollbar.component", () =>
  require("@fixtures/react/child").createComponent(["VerticalScrollbar"])
);

describe("VerticalScrollBarContainer", () => {
  let currentProps: VerticalScrollBarContainerProps;

  const mockVerticalAdjustment = 5;
  const mockScrollBarHeight = 150;
  const mockScrollBarTop = 160;
  const mockScrollThumbSize = 10;
  const mockScrollThumbOffset = 25;

  const mockDiv = document.createElement("div");

  mockDiv.id = "mockId";

  const mockRef = { current: mockDiv, value: "mocked" };
  const mockUpdate = jest.fn();
  const baseProps: VerticalScrollBarContainerProps = {
    verticalOffset: 5,
    horizontalOffset: 10,
    scrollRef: mockRef,
    update: mockUpdate,
    zIndex: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<VerticalScrollBarContainer {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
    mockUseVerticalScrollBarLayoutController.requiresScroll = false;
    mockUseVerticalScrollBarLayoutController.scrollBarHeight =
      mockScrollBarHeight;
    mockUseVerticalScrollBarLayoutController.scrollBarId =
      currentProps.scrollRef.current?.id;
    mockUseVerticalScrollBarLayoutController.scrollBarTop = mockScrollBarTop;
    mockUseVerticalScrollBarLayoutController.scrollThumbSize =
      mockScrollThumbSize;
    mockUseVerticalScrollBarLayoutController.scrollThumbOffset =
      mockScrollThumbOffset;
  };

  const checkUseVerticalScrollBarLayoutControllerRender = () => {
    it("should render the useVerticalScrollBarLayoutController hook as expected", () => {
      expect(useVerticalScrollLayoutController).toHaveBeenCalledTimes(1);
      expect(useVerticalScrollLayoutController).toHaveBeenCalledWith({
        scrollRef: currentProps.scrollRef,
        update: currentProps.update,
        verticalAdjustment: mockVerticalAdjustment,
      });
    });
  };

  const checkUseVerticalScrollBarEventsControllerRender = () => {
    it("should render the useVerticalScrollBarEventsController hook as expected", () => {
      expect(useVerticalScrollBarEventsController).toHaveBeenCalledTimes(1);
      expect(useVerticalScrollBarEventsController).toHaveBeenCalledWith({
        scrollRef: currentProps.scrollRef,
      });
    });
  };

  const checkVerticalScrollBarRender = () => {
    it("should render the title VerticalScrollBar with the correct props", () => {
      expect(VerticalScrollBar).toHaveBeenCalledTimes(1);

      const asCSS = (value: number) => `${value}px`;

      checkMockCall(
        VerticalScrollBar,
        {
          ariaControls: currentProps.scrollRef.current?.id,
          ariaValuenow:
            mockUseVerticalScrollBarLayoutController.scrollThumbOffset +
            mockVerticalAdjustment,
          ariaValuemin: 0,
          ariaValuemax:
            mockScrollBarHeight -
            mockUseVerticalScrollBarLayoutController.scrollThumbSize -
            mockVerticalAdjustment,
          mouseDownHandler:
            mockUseVerticalScrollBarEventsController.mouseDownHandler,
          thumbHeight: asCSS(
            mockUseVerticalScrollBarLayoutController.scrollThumbSize
          ),
          thumbOffsetTop: asCSS(
            mockUseVerticalScrollBarLayoutController.scrollThumbOffset
          ),
          trackHeight: asCSS(mockScrollBarHeight - mockVerticalAdjustment),
          trackOffsetRight: asCSS(currentProps.horizontalOffset),
          trackOffsetTop: asCSS(mockScrollBarTop + currentProps.verticalOffset),
          zIndex: currentProps.zIndex ? currentProps.zIndex : 0,
        },
        0
      );
    });
  };

  const checkNoVerticalScrollBarRender = () => {
    it("should not render the VerticalScrollBar Component", () => {
      expect(VerticalScrollBar).toHaveBeenCalledTimes(0);
    });
  };

  describe("with a custom zIndex value", () => {
    beforeEach(() => (currentProps.zIndex = 1));

    describe("when VerticalScrollBarDiv.requiresScroll returns false", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.requiresScroll = false;

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkNoVerticalScrollBarRender();
    });

    describe("when VerticalScrollBarDiv.requiresScroll returns true", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.requiresScroll = true;

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkVerticalScrollBarRender();
    });
  });

  describe("without a custom zIndex value", () => {
    beforeEach(() => (currentProps.zIndex = undefined));

    describe("when VerticalScrollBarDiv.requiresScroll returns false", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.requiresScroll = false;

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkNoVerticalScrollBarRender();
    });

    describe("when VerticalScrollBarDiv.requiresScroll returns true", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.requiresScroll = true;

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkVerticalScrollBarRender();
    });
  });
});
