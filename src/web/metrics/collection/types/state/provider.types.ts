import type { MetricsActionType } from "./action.types";
import type { MetricsStateType } from "./state.types";

export type MetricsTypes = "SEARCHES";

export type metricDispatchType = (action: MetricsActionType) => void;

export interface MetricsContextInterface {
  metrics: MetricsStateType;
  dispatch: metricDispatchType;
}
