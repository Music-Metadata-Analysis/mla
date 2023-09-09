import { Box } from "@chakra-ui/react";
import useColour from "@src/web/ui/colours/state/hooks/colour.hook";
import type { BoxProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

const Highlight = ({ children, ...boxProps }: PropsWithChildren<BoxProps>) => {
  const { highlightColour } = useColour();

  return (
    <Box
      color={highlightColour.foreground}
      bg={highlightColour.background}
      borderColor={highlightColour.border}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default Highlight;
