import PopUpsControllerReducerStates from "./popups.reducer.states.class";
import reducerLoggingMiddleware from "@src/utils/reducer.logger";
import withMiddleware from "@src/utils/reducer.middleware";
import type { PopUpsControllerActionType } from "@src/types/controllers/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/types/controllers/popups/popups.state.types";

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
