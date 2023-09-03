import type { RefObject } from "react";

export default class VerticalScrollBarDiv {
  protected _ref: HTMLDivElement | null;
  protected minimumThumbSize = 3;
  protected verticalAdjustment: number;

  constructor({
    scrollRef,
    verticalAdjustment,
  }: {
    scrollRef: RefObject<HTMLDivElement>;
    verticalAdjustment: number;
  }) {
    this._ref = scrollRef.current;
    this.verticalAdjustment = verticalAdjustment;
  }

  get ref() {
    return this._ref;
  }

  set ref(currentReference: HTMLDivElement | null) {
    this._ref = currentReference;
  }

  set onScroll(fn: () => void) {
    if (this.requiresScroll()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._ref!.onscroll = fn;
    }
  }

  requiresScroll() {
    if (!this._ref) return false;
    return this._ref.scrollHeight > this._ref.clientHeight;
  }
  getRefProperty(property: keyof HTMLDivElement) {
    if (!this._ref) return 0;
    const ref = this._ref as HTMLDivElement;
    return Number(ref[property]);
  }

  getScrollAttributes() {
    let scrollThumbSize = 0;
    let scrollThumbOffset = 0;

    if (this.requiresScroll()) {
      const totalHeight = this.getRefProperty("offsetHeight");
      const visibleAreaRatio =
        totalHeight / this.getRefProperty("scrollHeight");
      const scrollPosition = this.getRefProperty("scrollTop");

      scrollThumbSize = Math.max(
        Math.round(totalHeight * visibleAreaRatio) - this.verticalAdjustment,
        this.minimumThumbSize
      );
      scrollThumbOffset =
        Math.round(scrollPosition * visibleAreaRatio) - this.verticalAdjustment;
    }

    return {
      scrollThumbSize,
      scrollThumbOffset,
    };
  }
}
