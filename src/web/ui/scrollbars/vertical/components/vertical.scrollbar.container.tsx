import VerticalScrollBar from "./vertical.scrollbar.component";
import useVerticalScrollBarEventsController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.events.controller.hook";
import useVerticalScrollBarLayoutController from "@src/web/ui/scrollbars/vertical/state/controllers/vertical.scrollbar.layout.controller.hook";
import type { RefObject } from "react";

export interface VerticalScrollBarContainerProps {
  horizontalOffset: number;
  scrollRef: RefObject<HTMLDivElement>;
  update: unknown;
  verticalOffset: number;
  zIndex?: number;
}

const VerticalScrollBarContainer = ({
  horizontalOffset,
  verticalOffset,
  scrollRef,
  update,
  zIndex = 0,
}: VerticalScrollBarContainerProps) => {
  const verticalAdjustment = 5;

  const {
    requiresScroll,
    scrollBarHeight,
    scrollBarId,
    scrollBarTop,
    scrollThumbOffset,
    scrollThumbSize,
  } = useVerticalScrollBarLayoutController({
    scrollRef,
    update,
    verticalAdjustment,
  });

  const { mouseDownHandler } = useVerticalScrollBarEventsController({
    scrollRef,
  });

  const getAriaMaximumValue = () =>
    scrollBarHeight - scrollThumbSize - verticalAdjustment;

  const getAriaMinimumValue = () => {
    return 0;
  };

  const getAriaValueNow = () => {
    return scrollThumbOffset + verticalAdjustment;
  };

  const getThumbHeight = () => asCSS(scrollThumbSize);

  const getThumbOffsetTop = () => asCSS(scrollThumbOffset);

  const getTrackHeight = () => asCSS(scrollBarHeight - verticalAdjustment);

  const getTrackOffsetRight = () => asCSS(horizontalOffset);

  const getTrackOffsetTop = () => asCSS(scrollBarTop + verticalOffset);

  const asCSS = (value: number) => `${value}px`;

  if (!scrollBarId || !requiresScroll) return null;

  return (
    <VerticalScrollBar
      ariaControls={scrollBarId}
      ariaValuemax={getAriaMaximumValue()}
      ariaValuemin={getAriaMinimumValue()}
      ariaValuenow={getAriaValueNow()}
      mouseDownHandler={mouseDownHandler}
      thumbHeight={getThumbHeight()}
      thumbOffsetTop={getThumbOffsetTop()}
      trackHeight={getTrackHeight()}
      trackOffsetRight={getTrackOffsetRight()}
      trackOffsetTop={getTrackOffsetTop()}
      zIndex={zIndex}
    />
  );
};

export default VerticalScrollBarContainer;
