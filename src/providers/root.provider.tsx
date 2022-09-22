import AnalyticsProvider from "./analytics/analytics.provider";
import MetricsProvider from "./metrics/metrics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceRootProvider from "./ui/ui.root.provider";
import UserProvider from "./user/user.provider";
import authVendor from "../clients/auth/vendor";
import flagVendor from "../clients/flags/vendor";
import Header, { HeaderProps } from "../components/header/header.component";
import type { VendorAuthStateType } from "../clients/auth/vendor.types";
import type { VendorFlagStateType } from "../clients/flags/vendor.types";

type RootProviderProps = {
  headerProps?: HeaderProps;
  children: React.ReactChild | React.ReactChild[];
  flagState: VendorFlagStateType;
  session?: VendorAuthStateType;
};

const RootProvider = ({
  children,
  session,
  flagState,
  headerProps = { pageKey: "default" },
}: RootProviderProps) => {
  return (
    <authVendor.Provider session={session}>
      <flagVendor.Provider state={flagState}>
        <UserInterfaceRootProvider>
          <MetricsProvider>
            <UserProvider>
              <AnalyticsProvider>
                <NavBarProvider>
                  <Header pageKey={headerProps.pageKey} />
                  {children}
                </NavBarProvider>
              </AnalyticsProvider>
            </UserProvider>
          </MetricsProvider>
        </UserInterfaceRootProvider>
      </flagVendor.Provider>
    </authVendor.Provider>
  );
};

export default RootProvider;
