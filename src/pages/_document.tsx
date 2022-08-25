import { ColorModeScript } from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import flagVendor from "../clients/flags/vendor";

class BaseDocument extends Document {
  static async getServerSideProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const ssrFlags = new flagVendor.SSR();

    return {
      props: {
        session: await getSession(),
        flagState: ssrFlags.fetchState(),
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
