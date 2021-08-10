import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const createTheme = () =>
  extendTheme({
    styles: {
      global: (props: Record<string, string>) => ({
        body: {
          fontFamily: "body",
          color: mode("gray.900", "gray.100")(props),
          bg: mode("gray.400", "gray.600")(props),
          lineHeight: "base",
        },
      }),
    },
  });

export default createTheme;
