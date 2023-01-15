import { voidFn } from "@src/utilities/generics/voids";
import type { MetricsContextInterface } from "@src/types/metrics/context.types";
import type { MetricsStateType } from "@src/types/metrics/state.types";

export const InitialState = {
  SearchMetric: 0,
} as MetricsStateType;

const InitialContext = <MetricsContextInterface>{
  metrics: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
