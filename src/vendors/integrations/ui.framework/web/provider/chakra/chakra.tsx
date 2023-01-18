import ChakraMainBackGround from "./chakra.background/background.component";
import ChakraConfigurationProvider from "./chakra.provider/chakra.configuration.provider.component";
import type { UIVendorProviderComponentProps } from "@src/vendors/types/integrations/ui.framework/vendor.types";

const ChakraProvider = ({
  children,
  cookies,
}: UIVendorProviderComponentProps) => {
  return (
    <ChakraConfigurationProvider cookies={cookies}>
      <ChakraMainBackGround>{children}</ChakraMainBackGround>
    </ChakraConfigurationProvider>
  );
};

export default ChakraProvider;
