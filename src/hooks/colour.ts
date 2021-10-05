import { useColorMode } from "@chakra-ui/react";
import { useMemo } from "react";

const useColour = () => {
  const { colorMode } = useColorMode();

  const chooseColour = (colour1: string, colour2: string) => {
    if (colorMode === "light") return colour1;
    return colour2;
  };

  // Add consent cookie colours, and update mock

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
    },
    navButtonColour: {
      background: chooseColour("gray.300", "gray.900"),
      hoverBackground: chooseColour("gray.400", "gray.700"),
      selectedBackground: chooseColour("gray.400", "gray.700"),
    },
    transparent: "rgb(0,0,0,0)",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedColours = useMemo(generateColours, [colorMode]);

  return memoizedColours;
};

export default useColour;
