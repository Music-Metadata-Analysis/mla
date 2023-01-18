import { Box } from "@chakra-ui/react";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import type { ReactNode } from "react";

interface ChakraMainBackGroundProps {
  children: ReactNode;
}

const ChakraMainBackGround = ({ children }: ChakraMainBackGroundProps) => {
  const { bodyColour } = uiFrameworkVendor.core.colourHook();

  return (
    <Box bg={bodyColour.background} minHeight={"100vh"} minWidth={"100%"}>
      {children}
    </Box>
  );
};

export default ChakraMainBackGround;
