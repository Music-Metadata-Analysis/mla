import { useEffect, useState, useRef } from "react";
import VerticalScrollBarDiv from "./vertical.scrollbar.layout.controller.utility.class";
import type { RefObject } from "react";

export interface useVerticalScrollBarLayoutControllerProps {
  scrollRef: RefObject<HTMLDivElement>;
  update: unknown;
  verticalAdjustment: number;
}

const useVerticalScrollBarLayoutController = ({
  scrollRef,
  update,
  verticalAdjustment,
}: useVerticalScrollBarLayoutControllerProps) => {
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [scrollThumbSize, setScrollThumbSize] = useState(0);
  const scrollBarDiv = useRef(
    new VerticalScrollBarDiv({ scrollRef, verticalAdjustment })
  ).current;

  const recalculateScrollBar = () => {
    const attributes = scrollBarDiv.getScrollAttributes();
    setScrollThumbSize(attributes.scrollThumbSize);
    setScrollThumbOffset(attributes.scrollThumbOffset);
    scrollBarDiv.onScroll = recalculateScrollBar;
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
    scrollBarDiv.ref = scrollRef.current;
    if (scrollRef.current) {
      window.requestAnimationFrame(recalculateScrollBar);
      delayRecalculateScrollBar([100, 200, 300, 400, 500]);
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

  return {
    scrollBarDiv,
    scrollThumbSize,
    scrollThumbOffset,
  };
};

export default useVerticalScrollBarLayoutController;

export type VerticalScrollBarLayoutControllerHookType = ReturnType<
  typeof useVerticalScrollBarLayoutController
>;
