import type { MetricsActionType } from "../../types/metrics/action.types";
import type { MetricsStateType } from "../../types/metrics/state.types";

class MetricsReducerStates {
  wrongTypeError = "Received wrong action type.";

  SearchMetric(
    state: MetricsStateType,
    action: MetricsActionType
  ): MetricsStateType {
    if (action.type === "SearchMetric") {
      if (!(action.type in state)) state[action.type] = 0;
      return {
        ...state,
        [action.type]: state[action.type] + 1,
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default MetricsReducerStates;
