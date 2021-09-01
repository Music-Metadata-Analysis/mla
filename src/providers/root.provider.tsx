import AnalyticsProvider from "./analytics/analytics.provider";
import NavBarProvider from "./navbar/navbar.provider";
import UserInterfaceProvider from "./ui/ui.provider";
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
    <UserInterfaceProvider>
      <UserProvider>
        <AnalyticsProvider>
          <NavBarProvider>
            <Header pageKey={headerProps.pageKey} />
            {children}
          </NavBarProvider>
        </AnalyticsProvider>
      </UserProvider>
    </UserInterfaceProvider>
  );
};

export default RootProvider;
