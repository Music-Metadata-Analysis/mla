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

  const { scrollBarDiv, scrollThumbOffset, scrollThumbSize } =
    useVerticalScrollBarLayoutController({
      scrollRef,
      update,
      verticalAdjustment,
    });

  const { mouseDownHandler } = useVerticalScrollBarEventsController({
    scrollRef,
  });

  const getAriaMaximumValue = () => {
    return (
      scrollBarDiv.getRefProperty("offsetHeight") -
      scrollThumbSize -
      verticalAdjustment
    );
  };

  const getAriaMinimumValue = () => {
    return 0;
  };

  const getAriaValueNow = () => {
    return scrollThumbOffset + verticalAdjustment;
  };

  const getThumbHeight = () => asCSS(scrollThumbSize);

  const getThumbOffsetTop = () => asCSS(scrollThumbOffset);

  const getTrackHeight = () =>
    asCSS(scrollBarDiv.getRefProperty("offsetHeight") - verticalAdjustment);

  const getTrackOffsetRight = () => asCSS(horizontalOffset);

  const getTrackOffsetTop = () =>
    asCSS(scrollBarDiv.getRefProperty("offsetTop") + verticalOffset);

  const asCSS = (value: number) => `${value}px`;

  if (!scrollBarDiv.requiresScroll()) return null;

  return (
    <VerticalScrollBar
      ariaControls={scrollBarDiv.ref?.id}
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
