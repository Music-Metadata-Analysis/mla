import UserReducerStates from "./metrics.reducer.states.class";
import reducerLoggingMiddleware from "../../utils/reducer.logger";
import withMiddleware from "../../utils/reducer.middleware";
import type { MetricsActionType } from "../../types/metrics/action.types";
import type { MetricsStateType } from "../../types/metrics/state.types";

const metricsReducer = (state: MetricsStateType, action: MetricsActionType) => {
  const stateMethod = action.type;
  const stateGenerator = new UserReducerStates();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const MetricsReducer = withMiddleware(metricsReducer, middlewares);
