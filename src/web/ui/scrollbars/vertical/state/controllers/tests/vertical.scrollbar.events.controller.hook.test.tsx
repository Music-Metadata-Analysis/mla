import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import dk from "deep-keys";
import mockHookValues from "../__mocks__/vertical.scrollbar.events.controller.hook.mock";
import mockVerticalScrollBarEventHandlers, {
  activeScrollBarSetter,
} from "../__mocks__/vertical.scrollbar.events.controller.utility.class.mock";
import mockUseScrollBars from "@src/web/ui/scrollbars/generics/state/controllers/__mocks__/scrollbars.controller.hook.mock";
import useVerticalScrollBarEventsController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.events.controller.hook";
import type { RefObject, MouseEvent as ReactMouseEvent } from "react";

jest.mock(
  "@src/web/ui/scrollbars/generics/state/controllers/scrollbars.controller.hook"
);

jest.mock("../vertical.scrollbar.events.controller.utility.class");

describe("useVerticalScrollBarEventsController", () => {
  let received: ReturnType<typeof arrange>;
  let currentProps: {
    scrollRef: RefObject<HTMLDivElement>;
  };

  const mockDivId = "mockDivId";
  const mockActiveScrollBarID = "mockActiveScrollBarID";

  const baseProps = { scrollRef: { current: null } };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    return renderHook(() => useVerticalScrollBarEventsController(currentProps));
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkProperties = () => {
    it("should contain all the same properties as the mock hook", () => {
      const mockObjectKeys = dk(mockHookValues).sort();
      const hookKeys = dk(
        received.result.current as typeof mockHookValues
      ).sort();
      expect(hookKeys).toStrictEqual(mockObjectKeys);
    });

    it("should contain the correct functions", () => {
      expect(typeof received.result.current.mouseDownHandler).toBe("function");
    });
  };

  const checkRegister = () => {
    it("should register the hook handlers on mount (useEffect)", () => {
      expect(
        mockVerticalScrollBarEventHandlers.registerHookHandlers
      ).toHaveBeenCalledTimes(1);
      expect(
        mockVerticalScrollBarEventHandlers.registerHookHandlers
      ).toHaveBeenCalledWith();
    });
  };
  const checkDoesNotRegister = () => {
    it("should NOT register the hook handlers on mount (useEffect)", () => {
      expect(
        mockVerticalScrollBarEventHandlers.registerHookHandlers
      ).toHaveBeenCalledTimes(0);
    });
  };

  const checkActivatesScrollBar = () => {
    it("should activate the current scrollRef on mount (useEffect)", () => {
      expect(mockUseScrollBars.add).toHaveBeenCalledTimes(1);
      expect(mockUseScrollBars.add).toHaveBeenCalledWith(
        currentProps.scrollRef.current?.id
      );
    });
  };

  const checkDoesNotActivateScrollBar = () => {
    it("should NOT activate the current scrollRef on mount (useEffect)", () => {
      expect(mockUseScrollBars.add).toHaveBeenCalledTimes(0);
    });
  };

  const checkUnmount = () => {
    describe("when the hook unmounts (useEffect)", () => {
      beforeEach(() => {
        received.unmount();
      });

      it("should deactivate this scrollbar", async () => {
        await waitFor(() =>
          expect(mockUseScrollBars.remove).toHaveBeenCalledTimes(1)
        );
        expect(mockUseScrollBars.remove).toHaveBeenCalledWith();
      });

      it("should unregister the hook handlers", async () => {
        await waitFor(() =>
          expect(
            mockVerticalScrollBarEventHandlers.unregisterAllHandlers
          ).toHaveBeenCalledTimes(1)
        );
        expect(
          mockVerticalScrollBarEventHandlers.unregisterAllHandlers
        ).toHaveBeenCalledWith();
      });
    });
  };

  const checkMouseDownHandler = () => {
    describe("mouseDownHandler", () => {
      const mouseEvent = new MouseEvent(
        "mousedown"
      ) as unknown as ReactMouseEvent;

      beforeEach(() => {
        received.result.current.mouseDownHandler(mouseEvent);
      });

      it("should call the underlying VerticalScrollBarEventHandlers class method", () => {
        expect(
          mockVerticalScrollBarEventHandlers.mouseDownHandler
        ).toHaveBeenCalledTimes(1);
        expect(
          mockVerticalScrollBarEventHandlers.mouseDownHandler
        ).toHaveBeenCalledWith(mouseEvent);
      });
    });
  };

  describe("when the passed a scroll ref that has a null value", () => {
    beforeEach(() => {
      currentProps = { scrollRef: { current: null } };

      received = arrange();
    });

    checkProperties();
    checkDoesNotRegister();

    it("should NOT notify the handlers of the active scrollbar on mount (useEffect)", () => {
      expect(activeScrollBarSetter).toHaveBeenCalledTimes(0);
    });

    checkUnmount();
    checkDoesNotActivateScrollBar();

    it("should NOT notify the handlers of the newly mounted scrollbar on mount (useEffect)", () => {
      expect(activeScrollBarSetter).toHaveBeenCalledTimes(0);
    });

    checkMouseDownHandler();
  });

  describe("when the passed a scroll ref that has a div value", () => {
    beforeEach(() => {
      const element = document.createElement("div");
      element.id = mockDivId;

      currentProps = { scrollRef: { current: element } };
    });

    describe("with an active registered scrollbar", () => {
      beforeEach(() => {
        mockUseScrollBars.current.mockReturnValue(mockActiveScrollBarID);

        received = arrange();
      });

      checkProperties();
      checkRegister();

      it("should notify the handlers of the active scrollbar on mount (useEffect)", () => {
        expect(activeScrollBarSetter).toHaveBeenCalledTimes(2);
        expect(activeScrollBarSetter).toHaveBeenNthCalledWith(
          1,
          mockActiveScrollBarID
        );
      });

      checkUnmount();
      checkActivatesScrollBar();

      it("should notify the handlers of the newly mounted scrollbar on mount (useEffect)", async () => {
        expect(activeScrollBarSetter).toHaveBeenCalledTimes(2);
        expect(activeScrollBarSetter).toHaveBeenNthCalledWith(2, mockDivId);
      });

      checkMouseDownHandler();
    });

    describe("with no active registered scrollbar", () => {
      beforeEach(() => {
        mockUseScrollBars.current.mockReturnValue(undefined);

        received = arrange();
      });

      checkProperties();
      checkDoesNotRegister();

      it("should NOT notify the handlers of the active scrollbar on mount (useEffect)", () => {
        expect(activeScrollBarSetter).toHaveBeenCalledTimes(1);
        expect(activeScrollBarSetter).not.toHaveBeenCalledWith(
          mockActiveScrollBarID
        );
      });

      checkUnmount();
      checkActivatesScrollBar();

      it("should notify the handlers of the newly mounted scrollbar on mount (useEffect)", async () => {
        expect(activeScrollBarSetter).toHaveBeenCalledTimes(1);
        expect(activeScrollBarSetter).toHaveBeenCalledWith(mockDivId);
      });

      checkMouseDownHandler();
    });
  });
});
