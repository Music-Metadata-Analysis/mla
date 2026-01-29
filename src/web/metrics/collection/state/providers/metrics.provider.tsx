import { createContext } from "react";
import InitialValues from "./metrics.initial";
import { MetricsReducer } from "./metrics.reducer";
import settings from "@src/config/metrics";
import { persistenceVendor } from "@src/vendors/integrations/persistence/vendor";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { ReactNode } from "react";

export const MetricsContext = createContext({ ...InitialValues });

interface MetricsProviderProps {
  children: ReactNode;
}

const MetricsProvider = ({ children }: MetricsProviderProps) => {
  const [metrics, dispatch] =
    new persistenceVendor.localStorageReducerFactory().create(
      settings.localStorageKey,
      webFrameworkVendor.isSSR()
    )(MetricsReducer, InitialValues.metrics);

  return (
    <MetricsContext.Provider
      value={{
        metrics,
        dispatch,
      }}
    >
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;
