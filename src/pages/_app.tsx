import App, { AppContext } from "next/app";
import "../styles/globals.css";
import ConsentContainer from "@src/web/analytics/consent/components/consent.container";
import RootPopUpContainer from "@src/components/popups/root.popup.container";
import NavConfig from "@src/config/navbar";
import RootProvider from "@src/providers/root.provider";
import { normalizeUndefined } from "@src/utilities/generics/voids";
import { authVendorSSR } from "@src/vendors/integrations/auth/vendor.ssr";
import { flagVendorSSR } from "@src/vendors/integrations/flags/vendor.ssr";
import { localeVendor } from "@src/vendors/integrations/locale/vendor";
import NavBarContainer from "@src/web/navigation/navbar/components/navbar.container";
import type { HeaderContainerProps } from "@src/components/header/header.container";
import type { AuthVendorStateType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorStateInterface } from "@src/vendors/types/integrations/flags/vendor.types";
import type { UIVendorStateType } from "@src/vendors/types/integrations/ui.framework/vendor.types";
import type { WebFrameworkVendorAppComponentProps } from "@src/vendors/types/integrations/web.framework/vendor.types";

export interface MLAProps {
  cookies: UIVendorStateType;
  flagState: FlagVendorStateInterface;
  headerProps: HeaderContainerProps;
  session: AuthVendorStateType;
}

function MLA({
  Component,
  pageProps: { cookies, flagState, session, headerProps, ...otherProps },
}: WebFrameworkVendorAppComponentProps<MLAProps>) {
  return (
    <RootProvider
      cookies={cookies}
      flagState={flagState}
      session={session}
      headerProps={headerProps}
    >
      <NavBarContainer config={NavConfig.menuConfig} />
      <Component {...otherProps} />
      <RootPopUpContainer />
      <ConsentContainer />
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
