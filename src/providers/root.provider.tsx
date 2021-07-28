import AnalyticsProvider from "./analytics/analytics.provider";
import UserInterfaceProvider from "./ui/ui.provider";
import UserProvider from "./user/user.provider";
import Header from "../components/header/header.component";
import settings from "../config/app";

type RootProviderProps = {
  children: React.ReactChild | React.ReactChild[];
};

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <UserInterfaceProvider>
      <UserProvider>
        <AnalyticsProvider>
          <Header title={settings.title} />
          {children}
        </AnalyticsProvider>
      </UserProvider>
    </UserInterfaceProvider>
  );
};

export default RootProvider;
