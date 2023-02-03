import ControllersProvider from "./controllers/controllers.root.provider";
import HeaderContainer, {
  HeaderContainerProps,
} from "@src/components/header/header.container";
import { popUps } from "@src/config/popups";
import { authVendor } from "@src/vendors/integrations/auth/vendor";
import { flagVendor } from "@src/vendors/integrations/flags/vendor";
import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import AnalyticsProvider from "@src/web/analytics/collection/state/providers/analytics.provider";
import MetricsProvider from "@src/web/metrics/collection/state/providers/metrics.provider";
import UserProvider from "@src/web/reports/generics/state/providers/report.provider";
import type { AuthVendorStateType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { FlagVendorStateInterface } from "@src/vendors/types/integrations/flags/vendor.types";
import type { UIVendorStateType } from "@src/vendors/types/integrations/ui.framework/vendor.types";

type RootProviderProps = {
  cookies: UIVendorStateType;
  headerProps?: HeaderContainerProps;
  children: React.ReactChild | React.ReactChild[];
  flagState: FlagVendorStateInterface;
  session?: AuthVendorStateType;
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
          <uiFrameworkVendor.core.Provider cookies={cookies}>
            <uiFrameworkVendor.popups.Provider popUps={popUps}>
              <ControllersProvider>
                <MetricsProvider>
                  <UserProvider>
                    <HeaderContainer pageKey={headerProps.pageKey} />
                    {children}
                  </UserProvider>
                </MetricsProvider>
              </ControllersProvider>
            </uiFrameworkVendor.popups.Provider>
          </uiFrameworkVendor.core.Provider>
        </AnalyticsProvider>
      </flagVendor.Provider>
    </authVendor.Provider>
  );
};

export default RootProvider;
