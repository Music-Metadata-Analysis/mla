import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

const UserInterfaceProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <ChakraProvider>
      <ColorModeProvider
        options={{
          useSystemColorMode: false,
          initialColorMode: "dark",
        }}
      >
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default UserInterfaceProvider;
