import { useColorMode } from "@chakra-ui/react";
import type { ColourModeType } from "@src/types/clients/ui/vendor.types";

export default function useChakraColourMode() {
  const { toggleColorMode, colorMode } = useColorMode();

  return {
    colourMode: colorMode as ColourModeType,
    toggle: toggleColorMode,
  };
}
