import { useColorModeValue } from "@chakra-ui/react";

const useColour = () => {
  const background = useColorModeValue("gray.300", "gray.900");
  const details = "gray.900";
  const scheme = "gray";
  const foreground = useColorModeValue("gray.800", "gray.300");
  const bodyBackground = useColorModeValue("gray.400", "gray.500");
  const buttonBackground = useColorModeValue("gray.400", "gray.700");
  const buttonForeground = useColorModeValue("gray.900", "gray.200");
  const buttonBorder = useColorModeValue("gray.500", "gray.600");

  return {
    buttonColour: {
      background: buttonBackground,
      foreground: buttonForeground,
      border: buttonBorder,
    },
    componentColour: {
      background,
      details,
      foreground,
      scheme,
    },
    bodyColour: {
      background: bodyBackground,
    },
  };
};

export default useColour;
