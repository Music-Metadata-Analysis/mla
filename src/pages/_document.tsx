import { ColorModeScript } from "@chakra-ui/react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import authVendor from "../clients/auth/vendor";
import flagVendor from "../clients/flags/vendor";

class BaseDocument extends Document {
  static async getServerSideProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const ssrAuth = new authVendor.SSR();
    const ssrFlags = new flagVendor.SSR();

    return {
      props: {
        session: await ssrAuth.getSession(),
        flagState: await ssrFlags.fetchState(),
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
