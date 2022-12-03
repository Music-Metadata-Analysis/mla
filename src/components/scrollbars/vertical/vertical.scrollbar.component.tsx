import { Box } from "@chakra-ui/react";
import useColour from "@src/hooks/ui/colour.hook";
import type { MouseEventHandler } from "react";

export const testIDs = {
  ScrollBarTrack: "ScrollBarTrack",
  ScrollBarThumb: "ScrollBarThumb",
};

export interface VerticalScrollBarProps {
  ariaControls?: string;
  ariaValuenow: number;
  ariaValuemin: number;
  ariaValuemax: number;
  mouseDownHandler: MouseEventHandler;
  thumbHeight: string;
  thumbOffsetTop: string;
  trackHeight: string;
  trackOffsetRight: string;
  trackOffsetTop: string;
  zIndex: number;
}

const VerticalScrollBar = ({
  ariaControls,
  ariaValuemax,
  ariaValuemin,
  ariaValuenow,
  mouseDownHandler,
  thumbHeight,
  thumbOffsetTop,
  trackHeight,
  trackOffsetRight,
  trackOffsetTop,
  zIndex,
}: VerticalScrollBarProps) => {
  const { componentColour } = useColour();

  return (
    <Box
      aria-controls={ariaControls}
      aria-orientation={"vertical"}
      aria-valuemax={ariaValuemax}
      aria-valuemin={ariaValuemin}
      aria-valuenow={ariaValuenow}
      background={componentColour.background}
      borderColor={componentColour.foreground}
      borderRadius={"25px"}
      borderWidth={1}
      data-testid={testIDs.ScrollBarTrack}
      h={trackHeight}
      mt={1}
      onMouseDown={mouseDownHandler}
      position={"absolute"}
      right={trackOffsetRight}
      role={"scrollbar"}
      top={trackOffsetTop}
      w={"5px"}
      zIndex={zIndex}
    >
      <Box
        background={componentColour.foreground}
        borderRadius={"25px"}
        data-testid={testIDs.ScrollBarThumb}
        h={thumbHeight}
        mt={1}
        position={"absolute"}
        right={"-1px"}
        top={thumbOffsetTop}
        w={"5px"}
      />
    </Box>
  );
};

export default VerticalScrollBar;
