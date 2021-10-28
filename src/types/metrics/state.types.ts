export type AvailableMetrics = "SearchMetric";

export type MetricsStateType = {
  [T in AvailableMetrics]: number;
};
