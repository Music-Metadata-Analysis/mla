import { ColorModeScript } from "@chakra-ui/react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import uiFrameworkVendor from "@src/clients/ui.framework/vendor";

class BaseDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript
            initialColorMode={uiFrameworkVendor.config.initialColourMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BaseDocument;
