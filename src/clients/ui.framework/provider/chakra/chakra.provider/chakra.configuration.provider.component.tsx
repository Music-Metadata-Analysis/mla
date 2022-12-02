import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import createColourModeManager from "./utilities/chakra.colour.mode.manager.utility";
import createTheme from "./utilities/chakra.theme.utility";

const ChakraConfigurationProvider = ({
  children,
  cookies,
}: {
  children: JSX.Element;
  cookies: { [key: string]: string } | string;
}) => {
  const theme = createTheme();

  return (
    <ChakraProvider
      colorModeManager={createColourModeManager(
        cookies,
        theme.config.initialColorMode
      )}
      theme={theme}
    >
      <CSSReset />
      {children}
    </ChakraProvider>
  );
};

export default ChakraConfigurationProvider;
