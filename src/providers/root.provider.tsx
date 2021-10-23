import { SessionProvider } from "next-auth/react";
import AnalyticsProvider from "./analytics/analytics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceRootProvider from "./ui/ui.root.provider";
import UserProvider from "./user/user.provider";
import Header, { HeaderProps } from "../components/header/header.component";
import type { Session } from "next-auth";

type RootProviderProps = {
  headerProps?: HeaderProps;
  children: React.ReactChild | React.ReactChild[];
  session?: Session;
};

const RootProvider = ({
  children,
  session,
  headerProps = { pageKey: "default" },
}: RootProviderProps) => {
  return (
    <UserInterfaceRootProvider>
      <SessionProvider session={session}>
        <UserProvider>
          <AnalyticsProvider>
            <NavBarProvider>
              <Header pageKey={headerProps.pageKey} />
              {children}
            </NavBarProvider>
          </AnalyticsProvider>
        </UserProvider>
      </SessionProvider>
    </UserInterfaceRootProvider>
  );
};

export default RootProvider;
