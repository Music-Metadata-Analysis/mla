import React from "react";
import InitialValues from "./analytics.initial";
import type { AnalyticsVendorProviderInterface } from "@src/vendors/types/integrations/analytics/vendor.types";

export const AnalyticsContext = React.createContext(InitialValues);

const AnalyticsProvider = ({ children }: AnalyticsVendorProviderInterface) => {
  const [initialized, setInitialized] = React.useState(false);

  return (
    <AnalyticsContext.Provider
      value={{
        initialized,
        setInitialized,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
