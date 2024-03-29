import "@src/web/ui/css/root.css";
import App, { AppContext } from "next/app";
import NavConfig from "@src/config/navbar";
import { normalizeUndefined } from "@src/utilities/generics/voids";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import { authVendorSSR } from "@src/vendors/integrations/auth/vendor.ssr";
import { flagVendorSSR } from "@src/vendors/integrations/flags/vendor.ssr";
import { localeVendor } from "@src/vendors/integrations/locale/vendor";
import NavBarContainer from "@src/web/navigation/navbar/components/navbar.container";
import RootPopUpContainer from "@src/web/notifications/popups/components/root.popup.container";
import RootProvider from "@src/web/ui/generics/state/providers/root.provider";
import type { AuthVendorStateType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorStateInterface } from "@src/vendors/types/integrations/flags/vendor.types";
import type { UIVendorStateType } from "@src/vendors/types/integrations/ui.framework/vendor.types";
import type { WebFrameworkVendorAppComponentProps } from "@src/vendors/types/integrations/web.framework/vendor.types";
import type { HeaderContainerProps } from "@src/web/content/header/components/header.container";

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
      <analyticsVendor.collection.ConsentBannerComponent />
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
