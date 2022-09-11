import flagsmith from "flagsmith/isomorphic";
import { FlagsmithProvider, FlagsmithContextType } from "flagsmith/react";
import { SessionProvider } from "next-auth/react";
import AnalyticsProvider from "./analytics/analytics.provider";
import MetricsProvider from "./metrics/metrics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceRootProvider from "./ui/ui.root.provider";
import UserProvider from "./user/user.provider";
import Header, { HeaderProps } from "../components/header/header.component";
import type { VendorFlagStateType } from "../clients/flags/vendor.types";
import type { Session } from "next-auth";

type RootProviderProps = {
  headerProps?: HeaderProps;
  children: React.ReactChild | React.ReactChild[];
  flagState?: VendorFlagStateType;
  session?: Session;
};

const RootProvider = ({
  children,
  session,
  flagState,
  headerProps = { pageKey: "default" },
}: RootProviderProps) => {
  return (
    <FlagsmithProvider
      serverState={flagState}
      options={{
        environmentID: process.env.NEXT_PUBLIC_FLAGSMITH_ENVIRONMENT,
      }}
      flagsmith={flagsmith}
    >
      <UserInterfaceRootProvider>
        <SessionProvider session={session}>
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
        </SessionProvider>
      </UserInterfaceRootProvider>
    </FlagsmithProvider>
  );
};

export default RootProvider;
