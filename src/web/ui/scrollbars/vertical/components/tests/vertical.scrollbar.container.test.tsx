import { render } from "@testing-library/react";
import VerticalScrollBar from "../vertical.scrollbar.component";
import VerticalScrollBarContainer, {
  VerticalScrollBarContainerProps,
} from "../vertical.scrollbar.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockUseVerticalScrollBarEventsController from "@src/web/ui/scrollbars/vertical/state/controllers/__mocks__/vertical.scrollbar.events.controller.hook.mock";
import mockUseVerticalScrollBarLayoutController from "@src/web/ui/scrollbars/vertical/state/controllers/__mocks__/vertical.scrollbar.layout.controller.hook.mock";
import useVerticalScrollBarEventsController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.events.controller.hook";
import useVerticalScrollLayoutController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.layout.controller.hook";

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
  const mockPropertyValues = [150, 155, 160];
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
    mockUseVerticalScrollBarLayoutController.scrollBarDiv.ref =
      currentProps.scrollRef.current;
    mockUseVerticalScrollBarLayoutController.scrollBarDiv.getRefProperty = jest
      .fn()
      .mockReturnValueOnce(mockPropertyValues[0])
      .mockReturnValueOnce(mockPropertyValues[1])
      .mockReturnValueOnce(mockPropertyValues[2]);
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
            mockPropertyValues[0] -
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
          trackHeight: asCSS(mockPropertyValues[1] - mockVerticalAdjustment),
          trackOffsetRight: asCSS(currentProps.horizontalOffset),
          trackOffsetTop: asCSS(
            mockPropertyValues[2] + currentProps.verticalOffset
          ),
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

  const checkPropertyRetrieval = () => {
    it("should call the VerticalScrollBarDiv.getRefProperty method 3 times", () => {
      expect(
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.getRefProperty
      ).toHaveBeenCalledTimes(3);
      expect(
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.getRefProperty
      ).toHaveBeenNthCalledWith(1, "offsetHeight");
      expect(
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.getRefProperty
      ).toHaveBeenNthCalledWith(2, "offsetHeight");
      expect(
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.getRefProperty
      ).toHaveBeenNthCalledWith(3, "offsetTop");
    });
  };

  const checkNoPropertyRetrieval = () => {
    it("should NOT call the VerticalScrollBarDiv.getRefProperty method", () => {
      expect(
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.getRefProperty
      ).toHaveBeenCalledTimes(0);
    });
  };

  describe("with a custom zIndex value", () => {
    beforeEach(() => (currentProps.zIndex = 1));

    describe("when VerticalScrollBarDiv.requiresScroll returns false", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.requiresScroll =
          jest.fn(() => false);

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkNoVerticalScrollBarRender();
      checkNoPropertyRetrieval();
    });

    describe("when VerticalScrollBarDiv.requiresScroll returns true", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.requiresScroll =
          jest.fn(() => true);

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkVerticalScrollBarRender();
      checkPropertyRetrieval();
    });
  });

  describe("without a custom zIndex value", () => {
    beforeEach(() => (currentProps.zIndex = undefined));

    describe("when VerticalScrollBarDiv.requiresScroll returns false", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.requiresScroll =
          jest.fn(() => false);

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkNoVerticalScrollBarRender();
      checkNoPropertyRetrieval();
    });

    describe("when VerticalScrollBarDiv.requiresScroll returns true", () => {
      beforeEach(() => {
        mockUseVerticalScrollBarLayoutController.scrollBarDiv.requiresScroll =
          jest.fn(() => true);

        arrange();
      });

      checkUseVerticalScrollBarLayoutControllerRender();
      checkUseVerticalScrollBarEventsControllerRender();
      checkVerticalScrollBarRender();
      checkPropertyRetrieval();
    });
  });
});
