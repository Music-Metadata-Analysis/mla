import ChakraMainBackGround from "./chakra.background/background.component";
import ChakraConfigurationProvider from "./chakra.provider/chakra.configuration.provider.component";
import type { VendorProviderProps } from "@src/types/clients/ui.framework/vendor.types";

const ChakraProvider = ({ children, cookies }: VendorProviderProps) => {
  return (
    <ChakraConfigurationProvider cookies={cookies}>
      <ChakraMainBackGround>{children}</ChakraMainBackGround>
    </ChakraConfigurationProvider>
  );
};

export default ChakraProvider;
