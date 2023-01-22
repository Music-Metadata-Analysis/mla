import React from "react";
import InitialValues from "./analytics.initial";
import type { AnalyticsProviderInterface } from "@src/web/analytics/collection/types/state/provider.types";

export const AnalyticsContext = React.createContext(InitialValues);

const AnalyticsProvider = ({ children }: AnalyticsProviderInterface) => {
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
