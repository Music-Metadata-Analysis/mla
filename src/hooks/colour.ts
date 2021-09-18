import { useColorModeValue } from "@chakra-ui/react";

const useColour = () => {
  const mainBackground = useColorModeValue("gray.400", "gray.500");

  return {
    bodyColour: {
      background: mainBackground,
    },
  };
};

export default useColour;
