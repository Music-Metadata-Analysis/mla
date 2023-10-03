import UserReducerStates from "./metrics.reducer.states.class";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { MetricsActionType } from "@src/web/metrics/collection/types/state/action.types";
import type { MetricsStateType } from "@src/web/metrics/collection/types/state/state.types";

export const coreMetricsReducer = (
  state: MetricsStateType,
  action: MetricsActionType
) => {
  const stateMethod = action.type;
  const stateGenerator = new UserReducerStates();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [webFrameworkVendor.reducers.middlewares.logger];
export const MetricsReducer = webFrameworkVendor.reducers.applyMiddleware<
  MetricsStateType,
  MetricsActionType
>(coreMetricsReducer, middlewares);
