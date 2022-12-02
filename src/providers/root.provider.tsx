import AnalyticsProvider from "./analytics/analytics.provider";
import ControllersProvider from "./controllers/controllers.root.provider";
import MetricsProvider from "./metrics/metrics.provider";
import UserProvider from "./user/user.provider";
import authVendor from "@src/clients/auth/vendor";
import flagVendor from "@src/clients/flags/vendor";
import uiFrameworkVendor from "@src/clients/ui.framework/vendor";
import HeaderContainer, {
  HeaderContainerProps,
} from "@src/components/header/header.container";
import type { VendorAuthStateType } from "@src/clients/auth/vendor.types";
import type { VendorFlagStateType } from "@src/clients/flags/vendor.types";
import type { VendorStateType } from "@src/clients/ui.framework/vendor.types";

type RootProviderProps = {
  cookies: VendorStateType;
  headerProps?: HeaderContainerProps;
  children: React.ReactChild | React.ReactChild[];
  flagState: VendorFlagStateType;
  session?: VendorAuthStateType;
};

const RootProvider = ({
  cookies,
  children,
  session,
  flagState,
  headerProps = { pageKey: "default" },
}: RootProviderProps) => {
  return (
    <authVendor.Provider session={session}>
      <flagVendor.Provider state={flagState}>
        <AnalyticsProvider>
          <uiFrameworkVendor.Provider cookies={cookies}>
            <ControllersProvider>
              <MetricsProvider>
                <UserProvider>
                  <HeaderContainer pageKey={headerProps.pageKey} />
                  {children}
                </UserProvider>
              </MetricsProvider>
            </ControllersProvider>
          </uiFrameworkVendor.Provider>
        </AnalyticsProvider>
      </flagVendor.Provider>
    </authVendor.Provider>
  );
};

export default RootProvider;
