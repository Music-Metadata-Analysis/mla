import { waitFor, fireEvent } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import dk from "deep-keys";
import { useState } from "react";
import mockHookValues from "../__mocks__/vertical.scrollbar.layout.controller.hook.mock";
import useVerticalScrollBarLayoutController from "../vertical.scrollbar.layout.controller.hook";
import VerticalScrollBarDiv from "../vertical.scrollbar.layout.controller.utility.class";
import type { RefObject } from "react";

jest.mock("../vertical.scrollbar.layout.controller.utility.class");

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

  describe("when rendered", () => {
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
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(received.result.current.hook).sort();
      expect(
        hookKeys.filter((key) => key !== "scrollBarDiv.ref")
      ).toStrictEqual(mockObjectKeys);
    });

    it("should contain an instance of VerticalScrollDiv", () => {
      expect(received.result.current.hook.scrollBarDiv).toBeInstanceOf(
        VerticalScrollBarDiv
      );
      expect(VerticalScrollBarDiv).toBeCalledTimes(1);
      expect(VerticalScrollBarDiv).toBeCalledWith({
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
          ).toBeCalledTimes(1)
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
          ).toBeCalledTimes(6)
        );
      });

      it("should update the ref", () => {
        expect(mockSetter).toBeCalledTimes(2);
        expect(mockSetter).toBeCalledWith(mockScrollRef.current);
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
          ).toBeCalledTimes(6)
        );
        expect(received.result.current.hook.scrollThumbOffset).toBe(
          mockInternalAttributeScrollThumbOffset
        );
      });
    });
  });
});
