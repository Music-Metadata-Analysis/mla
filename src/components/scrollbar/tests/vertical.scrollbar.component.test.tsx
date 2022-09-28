import { Box } from "@chakra-ui/react";
import { act, render, fireEvent } from "@testing-library/react";
import VerticalScrollBarComponent, {
  testIDs,
  VerticalScrollBarProps,
} from "../vertical.scrollbar.component";
import mockColourHook from "@src/hooks/tests/colour.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";
import type { RefObject } from "react";

jest.mock("@src/hooks/colour", () => () => mockColourHook);

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Box"]);
});

describe("VerticalScrollBarComponent", () => {
  let currentProps: VerticalScrollBarProps;
  let mockRef: RefObject<HTMLDivElement>;
  let mockVerticalOffset: number;
  let mockHorizontalOffset: number;
  let mockZIndex: number | undefined;
  const mockUpdateObject = { mockUpdateObject: 1 };
  const mockScroll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getRef = () => {
    return mockRef.current as HTMLDivElement & {
      onscroll: NonNullable<HTMLDivElement["onscroll"]>;
      scrollHeight: number;
      clientHeight: number;
    };
  };

  const createMockRef = ({
    clientHeight,
    scrollHeight,
  }: {
    clientHeight: number;
    scrollHeight: number;
  }) => {
    return {
      current: {
        clientHeight,
        offsetHeight: 100,
        scrollHeight,
        scrollTop: 0,
        offsetTop: 0,
        scroll: mockScroll,
        id: "mockControlId",
      },
    } as unknown as RefObject<HTMLDivElement>;
  };

  const createProps = () =>
    (currentProps = {
      scrollRef: mockRef,
      verticalOffset: mockVerticalOffset,
      horizontalOffset: mockHorizontalOffset,
      update: mockUpdateObject,
      zIndex: mockZIndex,
    });

  const arrange = () => {
    createProps();
    render(<VerticalScrollBarComponent {...currentProps} />);
  };

  const checkScrollBarTrackProps = ({
    top,
    right,
    height,
    ariaMax,
    ariaValue,
    zIndex,
  }: {
    top: number;
    right: number;
    height: number;
    ariaMax: number;
    ariaValue: number;
    zIndex: number;
  }) => {
    it("should call the ScrollBarTrack Box component correctly", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          mt: 1,
          "data-testid": testIDs.ScrollBarTrack,
          position: "absolute",
          top: `${top}px`,
          right: `${right}px`,
          background: mockColourHook.componentColour.background,
          borderWidth: 1,
          borderColor: mockColourHook.componentColour.foreground,
          h: `${height}px`,
          w: "5px",
          borderRadius: "25px",
          zIndex: zIndex,
          role: "scrollbar",
          "aria-controls": "mockControlId",
          "aria-orientation": "vertical",
          "aria-valuenow": ariaValue,
          "aria-valuemin": 0,
          "aria-valuemax": ariaMax,
        },
        0,
        []
      );
    });
  };

  const checkScrollBarThumbProps = ({
    top,
    height,
  }: {
    top: number;
    height: number;
  }) => {
    it("should call the ScrollBarThumb Box component correctly", () => {
      expect(Box).toBeCalledTimes(2);
      checkMockCall(
        Box,
        {
          mt: 1,
          "data-testid": testIDs.ScrollBarThumb,
          position: "absolute",
          top: `${top}px`,
          right: "-1px",
          background: mockColourHook.componentColour.foreground,
          h: `${height}px`,
          w: "5px",
          borderRadius: "25px",
        },
        1,
        []
      );
    });
  };

  const checkScrollCalled = () => {
    it("should call scroll(0,0) on render", () => {
      expect(mockScroll).toBeCalledTimes(1);
      expect(mockScroll).toBeCalledWith(0, 0);
    });
  };

  const checkScrollHandler = () => {
    it("there should be a scroll handler attached to the ref", () => {
      expect(mockRef.current).toHaveProperty("onscroll");
      expect(typeof mockRef.current?.onscroll).toBe("function");
    });

    describe("when the scroll handler is called", () => {
      beforeEach(() => {
        getRef().scrollTop += 10;
        act(() => getRef().onscroll(null as unknown as Event));
      });

      it("it should trigger a re-render", () => {
        expect(Box).toBeCalledTimes(4);
      });
    });
  };

  const checkResizeHandler = () => {
    describe("when a window resize occurs, and props change", () => {
      beforeEach(() => {
        getRef().scrollHeight = 300;
        getRef().clientHeight = 200;
        fireEvent.resize(window);
      });

      it("it should trigger a re-render", () => {
        expect(Box).toBeCalledTimes(2);
      });

      checkScrollBarTrackProps({
        top: 100,
        right: 50,
        height: 95,
        ariaMax: 67,
        ariaValue: 0,
        zIndex: 5000,
      });
      checkScrollBarThumbProps({
        top: -5,
        height: 28,
      });
      checkScrollHandler();
    });
  };

  describe("when a component needs a scroll bar", () => {
    beforeEach(
      () => (mockRef = createMockRef({ clientHeight: 100, scrollHeight: 200 }))
    );

    describe("when the component is already scrolled to the top", () => {
      beforeEach(() => (getRef().scrollTop = 0));

      describe("when the scrollbar is given no vertical of horizontal offset", () => {
        beforeEach(() => {
          mockVerticalOffset = 0;
          mockHorizontalOffset = 0;
          mockZIndex = undefined;

          arrange();
        });

        checkScrollBarTrackProps({
          top: 0,
          right: 0,
          height: 95,
          ariaMax: 50,
          ariaValue: 0,
          zIndex: 0,
        });
        checkScrollBarThumbProps({
          top: -5,
          height: 45,
        });
        checkScrollHandler();
      });

      describe("when the scrollbar is given a vertical and horizontal offset, plus a zIndex", () => {
        beforeEach(() => {
          mockVerticalOffset = 100;
          mockHorizontalOffset = 50;
          mockZIndex = 5000;

          arrange();
        });

        checkScrollBarTrackProps({
          top: 100,
          right: 50,
          height: 95,
          ariaMax: 50,
          ariaValue: 0,
          zIndex: 5000,
        });
        checkScrollBarThumbProps({
          top: -5,
          height: 45,
        });
        checkScrollHandler();
      });
    });

    describe("when the component is already scrolled down", () => {
      beforeEach(() => (getRef().scrollTop = 20));

      describe("when the scrollbar is given no vertical of horizontal offset", () => {
        beforeEach(() => {
          mockVerticalOffset = 0;
          mockHorizontalOffset = 0;
          mockZIndex = undefined;

          arrange();
        });

        checkScrollBarTrackProps({
          top: 0,
          right: 0,
          height: 95,
          ariaMax: 50,
          ariaValue: 10,
          zIndex: 0,
        });
        checkScrollBarThumbProps({
          top: 5,
          height: 45,
        });
        checkScrollCalled();
        checkScrollHandler();
      });

      describe("when the scrollbar is given a vertical and horizontal offset, plus a zIndex", () => {
        beforeEach(() => {
          mockVerticalOffset = 100;
          mockHorizontalOffset = 50;
          mockZIndex = 5000;

          arrange();
        });

        checkScrollBarTrackProps({
          top: 100,
          right: 50,
          height: 95,
          ariaMax: 50,
          ariaValue: 10,
          zIndex: 5000,
        });
        checkScrollBarThumbProps({
          top: 5,
          height: 45,
        });
        checkScrollCalled();
        checkScrollHandler();
      });
    });
  });

  describe("when a component does NOT need a scroll bar", () => {
    beforeEach(() => {
      mockRef = createMockRef({ clientHeight: 100, scrollHeight: 100 });
      arrange();
    });

    it("should NOT call the ScrollBarTrack Box ", () => {
      expect(Box).toBeCalledTimes(0);
    });

    it("should NOT call the ScrollBarThumb Box ", () => {
      expect(Box).toBeCalledTimes(0);
    });

    checkResizeHandler();
  });

  describe("when a component has an incomplete ref object", () => {
    beforeEach(() => {
      mockRef = { current: null } as RefObject<HTMLDivElement>;
      arrange();
    });

    it("should NOT call the ScrollBarTrack Box ", () => {
      expect(Box).toBeCalledTimes(0);
    });

    it("should NOT call the ScrollBarThumb Box ", () => {
      expect(Box).toBeCalledTimes(0);
    });
  });
});
