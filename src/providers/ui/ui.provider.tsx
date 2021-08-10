import { ChakraProvider, ColorModeProvider, CSSReset } from "@chakra-ui/react";
import createTheme from "./ui.theme";

const UserInterfaceProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <ChakraProvider theme={createTheme()}>
      <ColorModeProvider
        options={{
          useSystemColorMode: false,
          initialColorMode: "dark",
        }}
      >
        <CSSReset />
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default UserInterfaceProvider;
