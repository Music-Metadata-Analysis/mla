import { ColorModeScript } from "@chakra-ui/react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import authVendorSSR from "../clients/auth/vendor.ssr";
import flagVendorSSR from "../clients/flags/vendor.ssr";

class BaseDocument extends Document {
  static async getServerSideProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const ssrFlags = new flagVendorSSR.Client();
    const ssrAuth = new authVendorSSR.Client();

    return {
      props: {
        flagState: await ssrFlags.getState(),
        session: await ssrAuth.getSession(),
        ...initialProps,
      },
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default BaseDocument;
