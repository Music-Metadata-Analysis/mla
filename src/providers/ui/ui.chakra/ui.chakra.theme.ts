import { extendTheme } from "@chakra-ui/react";

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
  });

export default createTheme;
