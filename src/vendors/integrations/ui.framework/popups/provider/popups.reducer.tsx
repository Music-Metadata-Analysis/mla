import PopUpsControllerReducerStates from "./popups.reducer.states.class";
import reducerLoggingMiddleware from "@src/utils/reducer.logger";
import withMiddleware from "@src/utils/reducer.middleware";
import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

const popUpsControllerReducer = (
  state: PopUpsControllerStateInterface,
  action: PopUpsControllerActionType
) => {
  const stateMethod = action.type;
  const stateGenerator = new PopUpsControllerReducerStates();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const PopUpsControllerReducer = withMiddleware<
  PopUpsControllerStateInterface,
  PopUpsControllerActionType
>(popUpsControllerReducer, middlewares);
