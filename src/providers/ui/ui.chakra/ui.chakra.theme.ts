import { extendTheme } from "@chakra-ui/react";

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

const createTheme = () =>
  extendTheme({
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

export default createTheme;
