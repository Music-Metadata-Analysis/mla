import { createContext, ReactNode } from "react";
import InitialValues from "./metrics.initial";
import { MetricsReducer } from "./metrics.reducer";
import PersistentReducerFactory from "@src/hooks/utility/local.storage/persisted.reducer.hook.factory.class";

export const MetricsContext = createContext({ ...InitialValues });

interface MetricsProviderProps {
  children: ReactNode;
}

const MetricsProvider = ({ children }: MetricsProviderProps) => {
  const [metrics, dispatch] = new PersistentReducerFactory().create("metrics")(
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
