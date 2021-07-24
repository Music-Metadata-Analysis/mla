import AnalyticsProvider from "./analytics/analytics.provider";
import UserProvider from "./user/user.provider";
import Header from "../components/header/header.component";
import settings from "../config/app";

const RootProvider = ({ children }: { children: React.ReactChild }) => {
  return (
    <UserProvider>
      <AnalyticsProvider>
        <Header title={settings.title} />
        {children}
      </AnalyticsProvider>
    </UserProvider>
  );
};

export default RootProvider;
