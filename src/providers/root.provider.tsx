import AnalyticsProvider from "./analytics/analytics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceRootProvider from "./ui/ui.root.provider";
import UserProvider from "./user/user.provider";
import Header, { HeaderProps } from "../components/header/header.component";

type RootProviderProps = {
  headerProps?: HeaderProps;
  children: React.ReactChild | React.ReactChild[];
};

const RootProvider = ({
  children,
  headerProps = { pageKey: "default" },
}: RootProviderProps) => {
  return (
    <UserInterfaceRootProvider>
      <UserProvider>
        <AnalyticsProvider>
          <NavBarProvider>
            <Header pageKey={headerProps.pageKey} />
            {children}
          </NavBarProvider>
        </AnalyticsProvider>
      </UserProvider>
    </UserInterfaceRootProvider>
  );
};

export default RootProvider;
