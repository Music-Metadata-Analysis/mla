import App, { AppContext } from "next/app";
import "../styles/globals.css";
import authVendorSSR from "@src/clients/auth/vendor.ssr";
import flagVendorSSR from "@src/clients/flags/vendor.ssr";
import localeVendor from "@src/clients/locale/vendor";
import Consent from "@src/components/consent/consent.component";
import NavBar from "@src/components/navbar/navbar.component";
import RootPopups from "@src/components/popups/root.popup";
import NavConfig from "@src/config/navbar";
import RootProvider from "@src/providers/root.provider";
import { normalizeUndefined } from "@src/utils/voids";
import type { VendorAppComponentProps } from "@src/clients/web.framework/vendor.types";

function MLA({
  Component,
  pageProps: { cookies, flagState, session, headerProps, ...otherProps },
}: VendorAppComponentProps) {
  return (
    <RootProvider
      cookies={cookies}
      flagState={flagState}
      session={session}
      headerProps={headerProps}
    >
      <NavBar config={NavConfig.menuConfig} />
      <Component {...otherProps} />
      <RootPopups />
      <Consent />
    </RootProvider>
  );
}

export const getInitialProps = async (appCtx: AppContext) => {
  const initialProps = await App.getInitialProps(appCtx);
  const session = await new authVendorSSR.Client().getSession({
    req: appCtx.ctx.req,
  });
  const flagState = await new flagVendorSSR.Client().getState(
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

export default localeVendor.HOC(MLA);
