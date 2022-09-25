import { createContext, ReactNode } from "react";
import InitialValues from "./metrics.initial";
import { MetricsReducer } from "./metrics.reducer";
import { getPersistedUseReducer } from "@src/hooks/utility/local.storage";

export const MetricsContext = createContext({ ...InitialValues });

interface MetricsProviderProps {
  children: ReactNode;
}

const MetricsProvider = ({ children }: MetricsProviderProps) => {
  const [metrics, dispatch] = getPersistedUseReducer("metrics")(
    MetricsReducer,
    InitialValues.metrics
  );

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
