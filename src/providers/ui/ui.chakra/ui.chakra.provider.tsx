import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import createColourModeManager from "./chakra.colour.mode.manager";
import createTheme from "./ui.chakra.theme";

const UserInterfaceChakraProvider = ({
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

export default UserInterfaceChakraProvider;
