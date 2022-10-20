import AnalyticsProvider from "./analytics/analytics.provider";
import MetricsProvider from "./metrics/metrics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceRootProvider from "./ui/ui.root.provider";
import UserProvider from "./user/user.provider";
import authVendor from "@src/clients/auth/vendor";
import flagVendor from "@src/clients/flags/vendor";
import Header, { HeaderProps } from "@src/components/header/header.component";
import type { VendorAuthStateType } from "@src/clients/auth/vendor.types";
import type { VendorFlagStateType } from "@src/clients/flags/vendor.types";

type RootProviderProps = {
  cookies: { [key: string]: string } | string;
  headerProps?: HeaderProps;
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
        <UserInterfaceRootProvider cookies={cookies}>
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
