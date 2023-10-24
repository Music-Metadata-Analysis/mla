import VerticalScrollBarEventHandlers from "../vertical.scrollbar.events.controller.utility.class";
import type { MouseEvent as ReactMouseEvent } from "react";
import type { RefObject } from "react";

describe(VerticalScrollBarEventHandlers.name, () => {
  let instance: VerticalScrollBarEventHandlers;
  let currentProps: RefObject<HTMLDivElement>;

  const scrollModifierValue = 4;

  const mockScrollbarId = "mockScrollbarId";

  const registerSpy = jest.spyOn(document, "addEventListener");
  const unregisterSpy = jest.spyOn(document, "removeEventListener");

  const baseProps = { current: null } as RefObject<HTMLDivElement>;

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () =>
    (instance = new VerticalScrollBarEventHandlers(currentProps));

  const resetProps = () => (currentProps = { ...baseProps });

  const createMockComponent = () => {
    const element = document.createElement("div");
    element.id = mockScrollbarId;
    return element;
  };

  type MutableMouseEvent = Omit<MouseEvent, "clientY"> & {
    clientY: number;
  };

  type MutableTouchEvent = Omit<TouchEvent, "changedTouches"> & {
    changedTouches: TouchList;
  };

  type MutableWheelEvent = Omit<WheelEvent, "deltaY"> & {
    deltaY: number;
  };

  const createReactMouseDownEvent = () => {
    const newEvent = new MouseEvent("mousedown") as unknown as ReactMouseEvent;
    Object.defineProperty(newEvent, "clientY", {
      writable: true,
      configurable: true,
    });
    return newEvent;
  };

  const createEvent = <
    T extends MutableMouseEvent | MutableTouchEvent | MutableWheelEvent
  >(
    EventConstructor: new (eventType: string) =>
      | MutableMouseEvent
      | MutableTouchEvent
      | MutableWheelEvent,
    eventType: string
  ) => {
    const newEvent = new EventConstructor(eventType) as T;
    Object.defineProperty(newEvent, "clientY", {
      writable: true,
      configurable: true,
    });
    Object.defineProperty(newEvent, "deltaY", {
      writable: true,
      configurable: true,
    });
    Object.defineProperty(newEvent, "preventDefault", {
      value: jest.fn(),
    });
    Object.defineProperty(newEvent, "changedTouches", {
      writable: true,
      configurable: true,
    });
    return newEvent;
  };

  const assignTouches = (
    event: MutableTouchEvent,
    changedTouches: { pageY: number }[]
  ) => {
    event.changedTouches = changedTouches as unknown as TouchList;
  };

  const checkProperties = () => {
    it("should contain the expected public functions", () => {
      expect(typeof instance.mouseDownHandler).toBe("function");
      expect(typeof instance.registerHookHandlers).toBe("function");
      expect(typeof instance.unregisterAllHandlers).toBe("function");
    });
  };

  const checkUnregisterAll = () => {
    describe("unregisterAllHandlers", () => {
      describe("when called", () => {
        beforeEach(() => instance.unregisterAllHandlers());

        it("should deregister every handler", async () => {
          expect(unregisterSpy).toBeCalledTimes(6);

          expect(unregisterSpy.mock.calls[0][0]).toBe("wheel");
          expect(unregisterSpy.mock.calls[1][0]).toBe("touchstart");
          expect(unregisterSpy.mock.calls[2][0]).toBe("mousemove");
          expect(unregisterSpy.mock.calls[3][0]).toBe("mouseup");
          expect(unregisterSpy.mock.calls[4][0]).toBe("touchend");
          expect(unregisterSpy.mock.calls[5][0]).toBe("touchmove");
        });
      });
    });
  };

  describe("when the passed a scroll ref that has a null value", () => {
    beforeEach(() => {
      currentProps = { current: null };

      arrange();
    });

    checkProperties();

    describe("mouseDownHandler", () => {
      let mouseDownEvent: ReactMouseEvent;

      describe("when passed a mouseDown event", () => {
        beforeEach(() => {
          mouseDownEvent = createReactMouseDownEvent();

          instance.mouseDownHandler(mouseDownEvent);
        });

        it("should not register any handlers", () => {
          expect(registerSpy).toBeCalledTimes(0);
        });
      });
    });

    describe("registerHookHandlers", () => {
      describe("when called", () => {
        beforeEach(() => instance.registerHookHandlers());

        it("should register the hook handlers", () => {
          expect(registerSpy).toBeCalledTimes(2);

          expect(registerSpy.mock.calls[0][0]).toBe("wheel");
          expect(registerSpy.mock.calls[1][0]).toBe("touchstart");
        });

        describe("wheelHandler", () => {
          let wheelHandler: EventListener;
          let wheelEvent: MutableWheelEvent;

          beforeEach(
            () => (wheelHandler = registerSpy.mock.calls[0][1] as EventListener)
          );

          describe("when passed a wheel event", () => {
            beforeEach(() => {
              wheelEvent = createEvent<MutableWheelEvent>(WheelEvent, "wheel");
              wheelEvent.deltaY = 200;

              wheelHandler(wheelEvent);
            });

            it("should do nothing", () => {
              expect(true).toBe(true);
            });
          });
        });

        describe("touchStartHandler", () => {
          let touchStartHandler: EventListener;
          let touchStartEvent: MutableTouchEvent;

          beforeEach(
            () =>
              (touchStartHandler = registerSpy.mock
                .calls[1][1] as EventListener)
          );

          describe("when passed a touchstart event", () => {
            beforeEach(() => {
              touchStartEvent = createEvent<MutableTouchEvent>(
                TouchEvent,
                "touchstart"
              );
              assignTouches(touchStartEvent, [{ pageY: 300 }]);

              touchStartHandler(touchStartEvent);
            });

            it("should do nothing", () => {
              expect(true).toBe(true);
            });
          });
        });
      });
    });

    checkUnregisterAll();
  });

  describe("when the passed a scroll ref that has a value", () => {
    let element: HTMLDivElement;
    const elementStartingScrollTop = 100;

    beforeEach(() => {
      element = createMockComponent() as unknown as HTMLDivElement;

      currentProps = { current: element };
      element.scrollTop = elementStartingScrollTop;

      arrange();
    });

    describe("when a matching activeScroll bar is set", () => {
      beforeEach(() => {
        instance.activeScrollBar = mockScrollbarId;
      });

      checkProperties();

      describe("mouseDownHandler", () => {
        let mouseDownEvent: ReactMouseEvent;

        describe("when passed a mousedown event", () => {
          mouseDownEvent = createReactMouseDownEvent();
          mouseDownEvent.clientY = 100;

          beforeEach(() => instance.mouseDownHandler(mouseDownEvent));

          it("should register the mouse event handlers", () => {
            expect(registerSpy).toBeCalledTimes(2);

            expect(registerSpy.mock.calls[0][0]).toBe("mousemove");
            expect(registerSpy.mock.calls[1][0]).toBe("mouseup");
          });

          describe("mouseMoveHandler", () => {
            let mouseMoveHandler: EventListener;
            let mouseMoveEvent: MutableMouseEvent;

            beforeEach(
              () =>
                (mouseMoveHandler = registerSpy.mock
                  .calls[0][1] as EventListener)
            );

            describe("when passed a mousemove event", () => {
              beforeEach(() => {
                mouseMoveEvent = createEvent<MutableMouseEvent>(
                  MouseEvent,
                  "mousemove"
                );
                mouseMoveEvent.clientY = 250;

                mouseMoveHandler(mouseMoveEvent);
              });

              it("should scroll the element as expected", () => {
                expect(element.scrollTop).toBe(
                  elementStartingScrollTop +
                    (mouseMoveEvent.clientY - mouseDownEvent.clientY) /
                      scrollModifierValue
                );
              });
            });
          });

          describe("mouseUpHandler", () => {
            let mouseUpHandler: EventListener;
            let mouseUpEvent: MutableMouseEvent;

            beforeEach(
              () =>
                (mouseUpHandler = registerSpy.mock.calls[1][1] as EventListener)
            );

            describe("when passed a mouseup event", () => {
              beforeEach(() => {
                mouseUpEvent = createEvent<MutableMouseEvent>(
                  MouseEvent,
                  "mouseup"
                );

                mouseUpHandler(mouseUpEvent);
              });

              it("should deregister the mouse event handlers", async () => {
                expect(unregisterSpy).toBeCalledTimes(2);

                expect(unregisterSpy.mock.calls[0][0]).toBe("mousemove");
                expect(unregisterSpy.mock.calls[1][0]).toBe("mouseup");
              });
            });
          });
        });
      });

      describe("registerHookHandlers", () => {
        describe("when called", () => {
          beforeEach(() => instance.registerHookHandlers());

          it("should register the hook handlers", () => {
            expect(registerSpy).toBeCalledTimes(2);

            expect(registerSpy.mock.calls[0][0]).toBe("wheel");
            expect(registerSpy.mock.calls[1][0]).toBe("touchstart");
          });

          describe("wheelHandler", () => {
            let wheelHandler: EventListener;
            let wheelEvent: MutableWheelEvent;

            beforeEach(
              () =>
                (wheelHandler = registerSpy.mock.calls[0][1] as EventListener)
            );

            describe("when passed a wheel event", () => {
              beforeEach(() => {
                wheelEvent = createEvent<MutableWheelEvent>(
                  WheelEvent,
                  "wheel"
                );
                wheelEvent.deltaY = 200;

                wheelHandler(wheelEvent);
              });

              it("should scroll the element as expected", () => {
                expect(element.scrollTop).toBe(
                  elementStartingScrollTop +
                    wheelEvent.deltaY / scrollModifierValue
                );
              });
            });
          });

          describe("touchStartHandler", () => {
            let touchStartHandler: EventListener;
            let touchStartEvent: MutableTouchEvent;

            beforeEach(
              () =>
                (touchStartHandler = registerSpy.mock
                  .calls[1][1] as EventListener)
            );

            describe("when passed a touchstart event", () => {
              beforeEach(() => {
                touchStartEvent = createEvent<MutableTouchEvent>(
                  TouchEvent,
                  "touchstart"
                );
                assignTouches(touchStartEvent, [{ pageY: 300 }]);

                touchStartHandler(touchStartEvent);
              });

              it("should register the mouse event handlers", () => {
                expect(registerSpy).toBeCalledTimes(4);

                expect(registerSpy.mock.calls[2][0]).toBe("touchmove");
                expect(registerSpy.mock.calls[3][0]).toBe("touchend");
              });

              describe("touchMoveHandler", () => {
                let touchMoveHandler: EventListener;
                let touchMoveEvent: MutableTouchEvent;

                beforeEach(
                  () =>
                    (touchMoveHandler = registerSpy.mock
                      .calls[2][1] as EventListener)
                );

                describe("when passed a touchmove event", () => {
                  beforeEach(() => {
                    touchMoveEvent = createEvent<MutableTouchEvent>(
                      TouchEvent,
                      "touchmove"
                    );
                    assignTouches(touchMoveEvent, [{ pageY: 250 }]);

                    touchMoveHandler(touchMoveEvent);
                  });

                  it("should scroll the element as expected", () => {
                    const deltaY =
                      touchMoveEvent.changedTouches[0].pageY -
                      touchStartEvent.changedTouches[0].pageY;

                    expect(element.scrollTop).toBe(
                      elementStartingScrollTop - deltaY
                    );
                  });
                });
              });

              describe("touchEndHandler", () => {
                let touchEndHandler: EventListener;
                let touchEndEvent: MutableTouchEvent;

                beforeEach(
                  () =>
                    (touchEndHandler = registerSpy.mock
                      .calls[3][1] as EventListener)
                );

                describe("when passed a touchend event", () => {
                  beforeEach(() => {
                    touchEndEvent = createEvent<MutableTouchEvent>(
                      TouchEvent,
                      "touchend"
                    );

                    touchEndHandler(touchEndEvent);
                  });

                  it("should deregister the touch event handlers", async () => {
                    expect(unregisterSpy).toBeCalledTimes(2);

                    expect(unregisterSpy.mock.calls[0][0]).toBe("touchend");
                    expect(unregisterSpy.mock.calls[1][0]).toBe("touchmove");
                  });
                });
              });
            });
          });
        });
      });

      checkUnregisterAll();
    });

    describe("when a matching activeScroll bar is NOT set", () => {
      beforeEach(() => {
        instance.activeScrollBar = undefined;
      });

      checkProperties();

      describe("mouseDownHandler", () => {
        let mouseDownEvent: ReactMouseEvent;

        describe("when passed a mousedown event", () => {
          mouseDownEvent = createReactMouseDownEvent();
          mouseDownEvent.clientY = 100;

          beforeEach(() => instance.mouseDownHandler(mouseDownEvent));

          it("should register the mouse event handlers", () => {
            expect(registerSpy).toBeCalledTimes(2);

            expect(registerSpy.mock.calls[0][0]).toBe("mousemove");
            expect(registerSpy.mock.calls[1][0]).toBe("mouseup");
          });

          describe("mouseMoveHandler", () => {
            let mouseMoveHandler: EventListener;
            let mouseMoveEvent: MutableMouseEvent;

            beforeEach(
              () =>
                (mouseMoveHandler = registerSpy.mock
                  .calls[0][1] as EventListener)
            );

            describe("when passed a mousemove event", () => {
              beforeEach(() => {
                mouseMoveEvent = createEvent<MutableMouseEvent>(
                  MouseEvent,
                  "mousemove"
                );
                mouseMoveEvent.clientY = 250;

                mouseMoveHandler(mouseMoveEvent);
              });

              it("should scroll the element as expected", () => {
                expect(element.scrollTop).toBe(
                  elementStartingScrollTop +
                    (mouseMoveEvent.clientY - mouseDownEvent.clientY) /
                      scrollModifierValue
                );
              });
            });
          });

          describe("mouseUpHandler", () => {
            let mouseUpHandler: EventListener;
            let mouseUpEvent: MutableMouseEvent;

            beforeEach(
              () =>
                (mouseUpHandler = registerSpy.mock.calls[1][1] as EventListener)
            );

            describe("when passed a mouseup event", () => {
              beforeEach(() => {
                mouseUpEvent = createEvent<MutableMouseEvent>(
                  MouseEvent,
                  "mouseup"
                );

                mouseUpHandler(mouseUpEvent);
              });

              it("should deregister the mouse event handlers", async () => {
                expect(unregisterSpy).toBeCalledTimes(2);

                expect(unregisterSpy.mock.calls[0][0]).toBe("mousemove");
                expect(unregisterSpy.mock.calls[1][0]).toBe("mouseup");
              });
            });
          });
        });
      });

      describe("registerHookHandlers", () => {
        describe("when called", () => {
          beforeEach(() => instance.registerHookHandlers());

          it("should register the hook handlers", () => {
            expect(registerSpy).toBeCalledTimes(2);

            expect(registerSpy.mock.calls[0][0]).toBe("wheel");
            expect(registerSpy.mock.calls[1][0]).toBe("touchstart");
          });

          describe("wheelHandler", () => {
            let wheelHandler: EventListener;
            let wheelEvent: MutableWheelEvent;

            beforeEach(
              () =>
                (wheelHandler = registerSpy.mock.calls[0][1] as EventListener)
            );

            describe("when passed a wheel event", () => {
              beforeEach(() => {
                wheelEvent = createEvent<MutableWheelEvent>(
                  WheelEvent,
                  "wheel"
                );
                wheelEvent.deltaY = 200;

                wheelHandler(wheelEvent);
              });

              it("should NOT scroll the element", () => {
                expect(element.scrollTop).toBe(elementStartingScrollTop);
              });
            });
          });

          describe("touchStartHandler", () => {
            let touchStartHandler: EventListener;
            let touchStartEvent: MutableTouchEvent;

            beforeEach(
              () =>
                (touchStartHandler = registerSpy.mock
                  .calls[1][1] as EventListener)
            );

            describe("when passed a touchstart event", () => {
              beforeEach(() => {
                touchStartEvent = createEvent<MutableTouchEvent>(
                  TouchEvent,
                  "touchstart"
                );
                assignTouches(touchStartEvent, [{ pageY: 300 }]);

                touchStartHandler(touchStartEvent);
              });

              it("should NOT register the touch event handlers", () => {
                expect(registerSpy).toBeCalledTimes(2);
              });
            });
          });
        });
      });

      checkUnregisterAll();
    });
  });
});
