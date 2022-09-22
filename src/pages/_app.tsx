import { appWithTranslation } from "next-i18next";
import App, { AppContext } from "next/app";
import "../styles/globals.css";
import authVendor from "../clients/auth/vendor";
import flagVendor from "../clients/flags/vendor";
import Consent from "../components/consent/consent.component";
import NavBar from "../components/navbar/navbar.component";
import RootPopups from "../components/popups/root.popup";
import NavConfig from "../config/navbar";
import RootProvider from "../providers/root.provider";
import { normalizeUndefined } from "../utils/voids";
import type { AppProps } from "next/app";

function MLA({
  Component,
  pageProps: { flagState, session, headerProps, ...otherProps },
}: AppProps) {
  return (
    <RootProvider
      flagState={flagState}
      session={session}
      headerProps={headerProps}
    >
      <NavBar menuConfig={NavConfig.menuConfig} />
      <Component {...otherProps} />
      <RootPopups />
      <Consent />
    </RootProvider>
  );
}

export const getInitialProps = async (appCtx: AppContext) => {
  const initialProps = await App.getInitialProps(appCtx);
  const session = await new authVendor.SSR().getSession({
    req: appCtx.ctx.req,
  });
  const flagState = await new flagVendor.SSR().getState(
    session?.group as string | null
  );

  return {
    pageProps: {
      flagState,
      session: normalizeUndefined(session),
      ...initialProps,
    },
  };
};

MLA.getInitialProps = getInitialProps;

export default appWithTranslation(MLA);
