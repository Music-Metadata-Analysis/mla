import { Box } from "@chakra-ui/react";
import useColour from "../../hooks/colour";
import type { ReactNode } from "react";

interface BackGroundProps {
  children: ReactNode;
}

const BackGround = ({ children }: BackGroundProps) => {
  const { bodyColour } = useColour();

  return (
    <Box bg={bodyColour.background} minHeight={"100vh"} minWidth={"100%"}>
      {children}
    </Box>
  );
};

export default BackGround;
