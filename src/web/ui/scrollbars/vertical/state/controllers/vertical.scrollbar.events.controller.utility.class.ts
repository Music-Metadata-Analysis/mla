import type { RefObject } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

export default class VerticalScrollBarEventHandlers {
  protected _activeScrollBar?: string;
  protected scrollModifier = 4;
  protected scrollRef: RefObject<HTMLDivElement>;
  protected startY = 0;

  constructor(scrollRef: RefObject<HTMLDivElement>) {
    this.scrollRef = scrollRef;
    this._activeScrollBar = undefined;
  }
  set activeScrollBar(name: string | undefined) {
    this._activeScrollBar = name;
  }
  mouseDownHandler = (e: ReactMouseEvent) => {
    e.preventDefault();
    if (this.scrollRef.current) {
      this.startY = e.clientY;
      this.registerMouseHandlers();
    }
  };

  protected touchStartHandler = (e: TouchEvent) => {
    if (this._activeScrollBar !== this.scrollRef.current?.id) return;
    if (this.scrollRef.current) {
      this.startY = e.touches[0].pageY;
      this.registerTouchHandlers();
    }
  };

  protected wheelHandler = (e: WheelEvent) => {
    if (this._activeScrollBar !== this.scrollRef.current?.id) return;
    if (this.scrollRef.current) {
      this.scrollRef.current.scrollTop += e.deltaY / this.scrollModifier;
    }
  };

  protected mouseMoveHandler = (e: MouseEvent) => {
    e.preventDefault();
    const deltaY = e.clientY - this.startY;
    this.getDefinedRef().scrollTop += deltaY / this.scrollModifier;
  };

  protected touchMoveHandler = (e: TouchEvent) => {
    const deltaY = e.touches[0].pageY - this.startY;
    this.getDefinedRef().scrollTop += deltaY / this.scrollModifier;
  };

  protected getDefinedRef = () => {
    return this.scrollRef.current as Omit<HTMLDivElement, "scrollTop"> & {
      scrollTop: number;
    };
  };

  registerHookHandlers = () => {
    document.addEventListener("wheel", this.wheelHandler);
    document.addEventListener("touchstart", this.touchStartHandler);
  };

  protected registerMouseHandlers = () => {
    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.unregisterMouseHandlers);
  };

  protected registerTouchHandlers = () => {
    document.addEventListener("touchmove", this.touchMoveHandler);
    document.addEventListener("touchend", this.unregisterTouchHandlers);
  };

  protected unregisterHookHandlers = () => {
    document.removeEventListener("wheel", this.wheelHandler);
    document.removeEventListener("touchstart", this.touchStartHandler);
  };

  protected unregisterMouseHandlers = () => {
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    document.removeEventListener("mouseup", this.unregisterMouseHandlers);
  };

  protected unregisterTouchHandlers = () => {
    document.removeEventListener("touchend", this.unregisterTouchHandlers);
    document.removeEventListener("touchmove", this.touchMoveHandler);
  };

  unregisterAllHandlers = () => {
    this.unregisterHookHandlers();
    this.unregisterMouseHandlers();
    this.unregisterTouchHandlers();
  };
}
