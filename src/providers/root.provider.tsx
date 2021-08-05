import AnalyticsProvider from "./analytics/analytics.provider";
import UserInterfaceProvider from "./ui/ui.provider";
import UserProvider from "./user/user.provider";
import Header from "../components/header/header.component";
import translations from "../config/translations";

type RootProviderProps = {
  children: React.ReactChild | React.ReactChild[];
};

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <UserInterfaceProvider>
      <UserProvider>
        <AnalyticsProvider>
          <Header title={translations.app.title} />
          {children}
        </AnalyticsProvider>
      </UserProvider>
    </UserInterfaceProvider>
  );
};

export default RootProvider;
