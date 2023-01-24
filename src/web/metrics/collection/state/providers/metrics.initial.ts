import { voidFn } from "@src/utilities/generics/voids";
import type { MetricsContextInterface } from "@src/web/metrics/collection/types/state/provider.types";
import type { MetricsStateType } from "@src/web/metrics/collection/types/state/state.types";

export const InitialState = {
  SearchMetric: 0,
} as MetricsStateType;

const InitialContext = <MetricsContextInterface>{
  metrics: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
