import { waitFor, fireEvent } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react";
import * as React from "react";
import { useState } from "react";
import mockHookValues from "../__mocks__/vertical.scrollbar.layout.controller.hook.mock";
import useVerticalScrollBarLayoutController from "../vertical.scrollbar.layout.controller.hook";
import VerticalScrollBarDiv from "../vertical.scrollbar.layout.controller.utility.class";
import type { RefObject } from "react";

jest.mock("../vertical.scrollbar.layout.controller.utility.class");
jest.mock("react", () => {
  const actualReact = jest.requireActual("react");
  return {
    ...actualReact,
    useRef: jest.fn(actualReact.useRef),
  };
});

describe("useVerticalScrollBarLayoutController", () => {
  let received: ReturnType<typeof arrange>;
  let currentProps: {
    scrollRef: RefObject<HTMLDivElement>;
    verticalAdjustment: number;
    update: unknown;
  };

  const mockScrollNullRef = { current: null } as RefObject<HTMLDivElement>;
  const mockScrollRef = {
    current: document.createElement("div"),
  } as RefObject<HTMLDivElement>;

  const mockInternalAttributeScrollThumbSize = 100;
  const mockInternalAttributeScrollThumbOffset = 200;

  const registerSpy = jest.spyOn(window, "addEventListener");
  const unregisterSpy = jest.spyOn(window, "removeEventListener");

  const mockGetter = jest.fn();
  const mockSetter = jest.fn();

  const baseProps = {
    scrollRef: mockScrollNullRef,
    verticalAdjustment: 5,
    update: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    return renderHook(() => useTestHarness());
  };

  const useTestHarness = () => {
    const [props, setProps] = useState({ ...currentProps });

    const hook = useVerticalScrollBarLayoutController(props);

    return {
      hook,
      setProps,
    };
  };

  const resetProps = () => (currentProps = { ...baseProps });

  describe("when rendered with a valid scrollBarDiv ref", () => {
    beforeEach(() => {
      jest
        .mocked(VerticalScrollBarDiv.prototype)
        .getScrollAttributes.mockReturnValue({
          scrollThumbSize: mockInternalAttributeScrollThumbSize,
          scrollThumbOffset: mockInternalAttributeScrollThumbOffset,
        });
      Object.defineProperty(VerticalScrollBarDiv.prototype, "ref", {
        get: mockGetter,
        set: mockSetter,
      });

      received = arrange();
    });

    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = Object.keys(mockHookValues).sort();
      const hookKeys = Object.keys(received.result.current.hook).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should initialize a VerticalScrollBarDiv instance", () => {
      expect(VerticalScrollBarDiv).toHaveBeenCalledTimes(1);
      expect(VerticalScrollBarDiv).toHaveBeenCalledWith({
        scrollRef: currentProps.scrollRef,
        verticalAdjustment: currentProps.verticalAdjustment,
      });
    });

    it("should contain the expected default attributes", () => {
      expect(received.result.current.hook.scrollThumbSize).toBe(0);
      expect(received.result.current.hook.scrollThumbOffset).toBe(0);
    });

    it("should initialize a resize handler on mount (useEffect)", () => {
      const mockCalls = registerSpy.mock.calls.filter(
        (call) => call[0] !== "error"
      );

      expect(mockCalls.length).toBe(1);
      expect(mockCalls[0][0]).toBe("resize");
    });

    describe("when a resize event is emitted (useEffect)", () => {
      beforeEach(async () => {
        jest
          .mocked(VerticalScrollBarDiv.prototype.getScrollAttributes)
          .mockClear();

        fireEvent(window, new Event("resize"));
      });

      it("should recalculate the scroll attributes)", async () => {
        await waitFor(() =>
          expect(
            VerticalScrollBarDiv.prototype.getScrollAttributes
          ).toHaveBeenCalledTimes(1)
        );
        expect(received.result.current.hook.scrollThumbOffset).toBe(
          mockInternalAttributeScrollThumbOffset
        );
      });
    });

    describe("when the hook unmounts (useEffect)", () => {
      beforeEach(() => {
        received.unmount();
      });

      it("should unregister the resize handlers", () => {
        const mockCalls = unregisterSpy.mock.calls.filter(
          (call) => call[0] !== "error"
        );

        expect(mockCalls.length).toBe(1);
        expect(mockCalls[0][0]).toBe("resize");
      });
    });

    describe("when scrollRef is updated (useEffect)", () => {
      beforeEach(async () => {
        jest
          .mocked(VerticalScrollBarDiv.prototype.getScrollAttributes)
          .mockClear();

        act(() =>
          received.result.current.setProps({
            scrollRef: mockScrollRef,
            verticalAdjustment: 5,
            update: null,
          })
        );

        await waitFor(() =>
          expect(
            VerticalScrollBarDiv.prototype.getScrollAttributes
          ).toHaveBeenCalledTimes(6)
        );
      });

      it("should update the ref", () => {
        expect(mockSetter).toHaveBeenCalledTimes(2);
        expect(mockSetter).toHaveBeenCalledWith(mockScrollRef.current);
      });

      it("should update the returned attributes", () => {
        expect(received.result.current.hook.scrollThumbSize).toBe(
          mockInternalAttributeScrollThumbSize
        );
        expect(received.result.current.hook.scrollThumbOffset).toBe(
          mockInternalAttributeScrollThumbOffset
        );
      });

      it("should recalculate the scroll attributes 6 times total (including delayed updates)", async () => {
        await waitFor(() =>
          expect(
            VerticalScrollBarDiv.prototype.getScrollAttributes
          ).toHaveBeenCalledTimes(6)
        );
        expect(received.result.current.hook.scrollThumbOffset).toBe(
          mockInternalAttributeScrollThumbOffset
        );
      });
    });

    describe("when scrollRef is updated to a null value (useEffect)", () => {
      it("should reset the layout and avoid recalculating scroll attributes", async () => {
        jest
          .mocked(VerticalScrollBarDiv.prototype.requiresScroll)
          .mockReturnValue(true);
        jest
          .mocked(VerticalScrollBarDiv.prototype.getRefProperty)
          .mockReturnValue(42);
        mockGetter.mockReturnValue({ id: "scrollbar-id" });

        act(() =>
          received.result.current.setProps({
            scrollRef: mockScrollRef,
            verticalAdjustment: 5,
            update: null,
          })
        );

        await waitFor(() =>
          expect(
            VerticalScrollBarDiv.prototype.getScrollAttributes
          ).toHaveBeenCalledTimes(6)
        );
        expect(received.result.current.hook).toStrictEqual({
          requiresScroll: true,
          scrollBarHeight: 42,
          scrollBarId: "scrollbar-id",
          scrollBarTop: 42,
          scrollThumbOffset: mockInternalAttributeScrollThumbOffset,
          scrollThumbSize: mockInternalAttributeScrollThumbSize,
        });

        jest
          .mocked(VerticalScrollBarDiv.prototype.getScrollAttributes)
          .mockClear();

        act(() =>
          received.result.current.setProps({
            scrollRef: mockScrollNullRef,
            verticalAdjustment: 5,
            update: null,
          })
        );

        expect(mockSetter).toHaveBeenLastCalledWith(null);
        expect(received.result.current.hook).toStrictEqual({
          requiresScroll: false,
          scrollBarHeight: 0,
          scrollBarId: undefined,
          scrollBarTop: 0,
          scrollThumbOffset: 0,
          scrollThumbSize: 0,
        });
        expect(
          VerticalScrollBarDiv.prototype.getScrollAttributes
        ).not.toHaveBeenCalled();
      });
    });
  });

  describe("when rendered with a null scrollBarDiv ref", () => {
    beforeEach(() => {
      received = arrange();

      const scrollBarDivRef = jest
        .mocked(React.useRef)
        .mock.results.find(
          ({ value }) => value.current instanceof VerticalScrollBarDiv
        )?.value;

      if (!scrollBarDivRef) throw new Error("scrollBarDiv ref was not found");
      scrollBarDivRef.current = null;
      jest
        .mocked(VerticalScrollBarDiv.prototype.getScrollAttributes)
        .mockClear();
      fireEvent(window, new Event("resize"));
    });

    afterEach(() => received.unmount());

    it("should not recalculate scroll attributes", () => {
      expect(
        VerticalScrollBarDiv.prototype.getScrollAttributes
      ).not.toHaveBeenCalled();
    });

    it("should retain the default layout", () => {
      expect(received.result.current.hook).toStrictEqual({
        requiresScroll: false,
        scrollBarHeight: 0,
        scrollBarId: undefined,
        scrollBarTop: 0,
        scrollThumbOffset: 0,
        scrollThumbSize: 0,
      });
    });
  });
});
