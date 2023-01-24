import { useContext } from "react";
import { MetricsContext } from "@src/web/metrics/collection/state/providers/metrics.provider";
import type { MetricsActionType } from "@src/web/metrics/collection/types/state/action.types";

const useMetrics = () => {
  const { metrics, dispatch } = useContext(MetricsContext);

  const increment = (metric: MetricsActionType["type"]) => {
    dispatch({ type: metric });
  };

  return {
    metrics,
    increment,
  };
};

export default useMetrics;

export type MetricsHookType = ReturnType<typeof useMetrics>;
