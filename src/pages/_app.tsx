import "../styles/globals.css";
import { appWithTranslation } from "next-i18next";
import Consent from "../components/consent/consent.component";
import NavBar from "../components/navbar/navbar.component";
import NavConfig from "../config/navbar";
import RootProvider from "../providers/root.provider";
import type { AppProps } from "next/app";

function App({
  Component,
  pageProps: { session, headerProps, ...otherProps },
}: AppProps) {
  return (
    <RootProvider session={session} headerProps={headerProps}>
      <NavBar menuConfig={NavConfig.menuConfig} />
      <Component {...otherProps} />
      <Consent />
    </RootProvider>
  );
}
export default appWithTranslation(App);
