import { voidFn } from "../../utils/voids";
import type { MetricsContextInterface } from "../../types/metrics/context.types";
import type { MetricsStateType } from "../../types/metrics/state.types";

export const InitialState = {
  SearchMetric: 0,
} as MetricsStateType;

const InitialContext = <MetricsContextInterface>{
  metrics: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
