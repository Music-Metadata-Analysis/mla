import { ColorModeScript } from "@chakra-ui/react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createTheme from "@src/providers/ui/ui.chakra/ui.chakra.theme";

class BaseDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript
            initialColorMode={createTheme().config.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BaseDocument;
