import { extendTheme } from "@chakra-ui/react";
import uiFrameworkVendor from "@src/clients/ui.framework/vendor";

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
      initialColorMode: uiFrameworkVendor.config.initialColourMode,
      useSystemColorMode: uiFrameworkVendor.config.useSystemColourMode,
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
