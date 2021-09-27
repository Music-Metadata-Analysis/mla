import "../styles/globals.css";

import { appWithTranslation } from "next-i18next";
import Consent from "../components/consent/consent.component";
import NavBar from "../components/navbar/navbar.component";
import MenuConfig from "../config/navbar";
import RootProvider from "../providers/root.provider";
import type { AppProps } from "next/app";

function App({
  Component,
  pageProps: { headerProps, ...otherProps },
}: AppProps) {
  return (
    <RootProvider headerProps={headerProps}>
      <NavBar menuConfig={MenuConfig} />
      <Component {...otherProps} />
      <Consent />
    </RootProvider>
  );
}
export default appWithTranslation(App);
