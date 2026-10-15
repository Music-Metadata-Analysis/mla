import { useEffect, useRef, useState } from "react";
import VerticalScrollBarDiv from "./vertical.scrollbar.layout.controller.utility.class";
import type { RefObject } from "react";

export interface useVerticalScrollBarLayoutControllerProps {
  scrollRef: RefObject<HTMLDivElement>;
  update: unknown;
  verticalAdjustment: number;
}

interface VerticalScrollBarLayoutState {
  requiresScroll: boolean;
  scrollBarHeight: number;
  scrollBarId: string | undefined;
  scrollBarTop: number;
  scrollThumbOffset: number;
  scrollThumbSize: number;
}

const useVerticalScrollBarLayoutController = ({
  scrollRef,
  update,
  verticalAdjustment,
}: useVerticalScrollBarLayoutControllerProps) => {
  const [layout, setLayout] = useState<VerticalScrollBarLayoutState>({
    requiresScroll: false,
    scrollBarHeight: 0,
    scrollBarId: undefined,
    scrollBarTop: 0,
    scrollThumbOffset: 0,
    scrollThumbSize: 0,
  });
  const scrollBarDiv = useRef<VerticalScrollBarDiv | null>(null);

  const recalculateScrollBar = () => {
    const scrollBar = scrollBarDiv.current;
    if (!scrollBar) return;

    const attributes = scrollBar.getScrollAttributes();
    setLayout({
      requiresScroll: scrollBar.requiresScroll(),
      scrollBarHeight: scrollBar.getRefProperty("offsetHeight"),
      scrollBarId: scrollBar.ref?.id,
      scrollBarTop: scrollBar.getRefProperty("offsetTop"),
      scrollThumbOffset: attributes.scrollThumbOffset,
      scrollThumbSize: attributes.scrollThumbSize,
    });
    scrollBar.onScroll = recalculateScrollBar;
  };

  const delayRecalculateScrollBar = (timeouts: Array<number>) => {
    timeouts.forEach((timeout) => {
      setTimeout(
        () => window.requestAnimationFrame(recalculateScrollBar),
        timeout
      );
    });
  };

  useEffect(() => {
    if (!scrollBarDiv.current) {
      scrollBarDiv.current = new VerticalScrollBarDiv({
        scrollRef,
        verticalAdjustment,
      });
    }
    scrollBarDiv.current.ref = scrollRef.current;
    if (scrollRef.current) {
      window.requestAnimationFrame(recalculateScrollBar);
      delayRecalculateScrollBar([100, 200, 300, 400, 500]);
    } else {
      setLayout({
        requiresScroll: false,
        scrollBarHeight: 0,
        scrollBarId: undefined,
        scrollBarTop: 0,
        scrollThumbOffset: 0,
        scrollThumbSize: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, update]);

  useEffect(() => {
    window.addEventListener("resize", recalculateScrollBar);
    return () => {
      window.removeEventListener("resize", recalculateScrollBar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return layout;
};

export default useVerticalScrollBarLayoutController;

export type VerticalScrollBarLayoutControllerHookType = ReturnType<
  typeof useVerticalScrollBarLayoutController
>;
