import "../styles/globals.css";

import NavBar from "../components/navbar/navbar.component";
import MenuConfig from "../config/navbar";
import RootProvider from "../providers/root.provider";
import type { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <RootProvider>
      <NavBar menuConfig={MenuConfig} />
      <Component {...pageProps} />
    </RootProvider>
  );
}
export default App;
