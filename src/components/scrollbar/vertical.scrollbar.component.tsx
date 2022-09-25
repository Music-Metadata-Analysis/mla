import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useColour from "@src/hooks/colour";
import type { RefObject } from "react";

export const testIDs = {
  ScrollBarTrack: "ScrollBarTrack",
  ScrollBarThumb: "ScrollBarThumb",
};

export interface VerticalScrollBarProps {
  scrollRef: RefObject<HTMLDivElement>;
  update: unknown;
  horizontalOffset: number;
  verticalOffset: number;
  zIndex?: number;
}

const VerticalScrollBarComponent = ({
  verticalOffset,
  horizontalOffset,
  scrollRef,
  update,
  zIndex = 0,
}: VerticalScrollBarProps) => {
  const [display, setDisplay] = useState(false);
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [scrollThumbSize, setScrollThumbSize] = useState(0);
  const { componentColour } = useColour();
  const verticalAdjustment = 5;

  const getAriaMaximumValue = () => {
    return (
      getRefProperty("offsetHeight") - scrollThumbSize - verticalAdjustment
    );
  };

  const getAriaMinimumValue = () => {
    return 0;
  };

  const getAriaValueNow = () => {
    return scrollThumbOffset + verticalAdjustment;
  };

  const getRefProperty = (property: keyof HTMLDivElement) => {
    const ref = scrollRef.current as HTMLDivElement;
    return Number(ref[property]);
  };

  const scrollToTop = () => {
    const ref = scrollRef.current as HTMLDivElement;
    ref.scroll(0, 0);
  };

  const shouldDisplayScrollBar = () => {
    const ref = scrollRef.current as HTMLDivElement;
    if (ref.scrollHeight > ref.clientHeight) {
      ref.onscroll = recalculateScrollbar;
      return setDisplay(true);
    }
    setDisplay(false);
  };

  const recalculateScrollbar = () => {
    shouldDisplayScrollBar();
    const viewableArea = getRefProperty("offsetHeight");
    const scrollableArea = viewableArea / getRefProperty("scrollHeight");
    const scrollPosition = getRefProperty("scrollTop");
    setScrollThumbSize(
      Math.round(viewableArea * scrollableArea) - verticalAdjustment
    );
    setScrollThumbOffset(
      Math.round(scrollPosition * scrollableArea) - verticalAdjustment
    );
  };

  useEffect(() => {
    if (!scrollRef.current) return setDisplay(false);
    scrollToTop();
    shouldDisplayScrollBar();
    recalculateScrollbar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, update]);

  useEffect(() => {
    window.addEventListener("resize", recalculateScrollbar);
    return () => {
      setDisplay(false);
      window.removeEventListener("resize", recalculateScrollbar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!display) return null;

  return (
    <Box
      mt={1}
      data-testid={testIDs.ScrollBarTrack}
      position={"absolute"}
      top={`${getRefProperty("offsetTop") + verticalOffset}px`}
      right={`${horizontalOffset}px`}
      background={componentColour.background}
      borderWidth={1}
      borderColor={componentColour.foreground}
      h={`${getRefProperty("offsetHeight") - verticalAdjustment}px`}
      w={"5px"}
      borderRadius={"25px"}
      zIndex={zIndex}
      role={"scrollbar"}
      aria-controls={scrollRef.current?.id}
      aria-orientation={"vertical"}
      aria-valuenow={getAriaValueNow()}
      aria-valuemin={getAriaMinimumValue()}
      aria-valuemax={getAriaMaximumValue()}
    >
      <Box
        mt={1}
        data-testid={testIDs.ScrollBarThumb}
        position={"absolute"}
        top={`${scrollThumbOffset}px`}
        right={"-1px"}
        background={componentColour.foreground}
        h={`${scrollThumbSize}px`}
        w={"5px"}
        borderRadius={"25px"}
      />
    </Box>
  );
};

export default VerticalScrollBarComponent;
