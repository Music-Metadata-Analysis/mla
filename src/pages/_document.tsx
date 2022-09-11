import { ColorModeScript } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import flagVendorSSR from "../clients/flags/vendor.ssr";

class BaseDocument extends Document {
  static async getServerSideProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const ssrFlags = new flagVendorSSR.Client();

    return {
      props: {
        session: await getSession(),
        flagState: await ssrFlags.getState(),
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
