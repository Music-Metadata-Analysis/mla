import { useContext } from "react";
import { MetricsContext } from "../providers/metrics/metrics.provider";
import type { MetricsActionType } from "../types/metrics/action.types";

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
