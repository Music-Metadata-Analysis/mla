import "../styles/globals.css";

import RootProvider from "../providers/root.provider";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <RootProvider>
      <Component {...pageProps} />
    </RootProvider>
  );
}
export default App;
