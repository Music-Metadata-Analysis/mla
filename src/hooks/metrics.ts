import { useContext } from "react";
import { MetricsContext } from "@src/providers/metrics/metrics.provider";
import type { MetricsActionType } from "@src/types/metrics/action.types";

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
