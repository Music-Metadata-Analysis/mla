import { useColorMode } from "@chakra-ui/react";
import { useMemo } from "react";
import type { UIVendorColourType } from "@src/vendors/types/integrations/ui.framework/vendor.types";

const useChakraColour = () => {
  const { colorMode } = useColorMode();

  const chooseColour = (
    colour1: UIVendorColourType,
    colour2: UIVendorColourType
  ) => {
    if (colorMode === "light") return colour1;
    return colour2;
  };

  const generateColours = () => ({
    bodyColour: {
      background: chooseColour("gray.400", "gray.500"),
    },
    buttonColour: {
      background: chooseColour("gray.400", "gray.700"),
      border: chooseColour("gray.500", "gray.600"),
      foreground: chooseColour("gray.900", "gray.200"),
      hoverBackground: chooseColour("gray.500", "gray.600"),
    },
    consentColour: {
      accept: {
        background: chooseColour("green.400", "green.700"),
      },
      decline: {
        background: chooseColour("red.400", "red.700"),
      },
    },
    componentColour: {
      background: chooseColour("gray.300", "gray.900"),
      border: chooseColour("gray.500", "gray.600"),
      details: "gray.900",
      foreground: chooseColour("gray.700", "gray.300"),
      scheme: "gray",
    },
    errorColour: {
      icon: chooseColour("yellow.800", "yellow.200"),
    },
    feedbackColour: {
      background: chooseColour("blue.300", "blue.300"),
      border: chooseColour("gray.900", "gray.900"),
      foreground: chooseColour("gray.800", "gray.800"),
    },
    flipCardColour: {
      background: chooseColour("gray.900", "gray.300"),
      border: chooseColour("gray.500", "gray.900"),
      foreground: chooseColour("gray.200", "gray.800"),
      textFront: "gray.800",
      textRear: chooseColour("gray.300", "gray.800"),
    },
    highlightColour: {
      background: chooseColour("gray.400", "gray.800"),
      foreground: chooseColour("gray.800", "gray.300"),
      border: chooseColour("gray.500", "gray.700"),
    },
    inputColour: {
      background: chooseColour("gray.400", "gray.700"),
      border: chooseColour("gray.500", "gray.600"),
      foreground: chooseColour("gray.900", "gray.200"),
      placeHolder: chooseColour("gray.300", "gray.400"),
    },
    modalColour: {
      background: chooseColour("gray.400", "gray.700"),
      border: chooseColour("gray.500", "gray.600"),
      foreground: chooseColour("gray.900", "gray.200"),
    },
    navButtonColour: {
      background: chooseColour("gray.300", "gray.900"),
      hoverBackground: chooseColour("gray.400", "gray.700"),
      selectedBackground: chooseColour("gray.400", "gray.700"),
    },
    sunBurstColour: {
      foreground: chooseColour("gray.900", "gray.300"),
    },
    transparent: "rgb(0,0,0,0)",
    utilities: {
      colourToCSS: (colour: UIVendorColourType) => {
        const value = `var(--chakra-colors-${String(colour).replace(
          ".",
          "-"
        )})`;
        return value;
      },
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedColours = useMemo(generateColours, [colorMode]);

  return memoizedColours;
};

export default useChakraColour;
