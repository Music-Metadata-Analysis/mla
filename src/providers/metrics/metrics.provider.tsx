import { createContext, ReactNode } from "react";
import InitialValues from "./metrics.initial";
import { MetricsReducer } from "./metrics.reducer";
import settings from "@src/config/metrics";
import PersistentReducerFactory from "@src/utilities/react/hooks/local.storage/persisted.reducer.hook.factory.class";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";

export const MetricsContext = createContext({ ...InitialValues });

interface MetricsProviderProps {
  children: ReactNode;
}

const MetricsProvider = ({ children }: MetricsProviderProps) => {
  const [metrics, dispatch] = new PersistentReducerFactory().create(
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
