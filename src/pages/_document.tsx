import { ColorModeScript } from "@chakra-ui/react";
import flagsmith from "flagsmith/isomorphic";
import { getSession } from "next-auth/react";
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class BaseDocument extends Document {
  static async getServerSideProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    await flagsmith.init({ environmentID: process.env.NEXT_PUBLIC_FLAGSMITH_ENVIRONMENT });

    return {
      props: {
        session: await getSession(),
        flagsmithState: flagsmith.getState(),
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
