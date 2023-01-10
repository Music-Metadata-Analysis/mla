import { ColorModeScript } from "@chakra-ui/react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";

class BaseDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript
            initialColorMode={uiFrameworkVendor.core.config.initialColourMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BaseDocument;
