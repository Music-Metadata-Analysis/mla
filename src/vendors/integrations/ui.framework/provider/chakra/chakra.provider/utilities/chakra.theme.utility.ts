import { extendTheme } from "@chakra-ui/react";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";

export const components = {
  Drawer: {
    variants: {
      alwaysOpen: {
        parts: ["dialog, dialogContainer"],
        dialog: {
          pointerEvents: "auto",
        },
        dialogContainer: {
          pointerEvents: "none",
        },
      },
    },
  },
};

const createChakraTheme = () =>
  extendTheme({
    config: {
      initialColorMode: uiFrameworkVendor.core.config.initialColourMode,
      useSystemColorMode: uiFrameworkVendor.core.config.useSystemColourMode,
    },
    styles: {
      global: {
        body: {
          fontFamily: "body",
          lineHeight: "base",
        },
      },
    },
    components,
  });

export default createChakraTheme;
