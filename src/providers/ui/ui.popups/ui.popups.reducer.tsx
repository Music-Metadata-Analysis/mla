import UserInterfacePopUpsReducerStates from "./ui.popups.reducer.states.class";
import reducerLoggingMiddleware from "../../../utils/reducer.logger";
import withMiddleware from "../../../utils/reducer.middleware";
import type { UserInterfacePopUpsActionType } from "../../../types/ui/popups/ui.popups.action.types";
import type { UserInterfacePopUpsStateInterface } from "../../../types/ui/popups/ui.popups.state.types";

const userInterfacePopUpsReducer = (
  state: UserInterfacePopUpsStateInterface,
  action: UserInterfacePopUpsActionType
) => {
  const stateMethod = action.type;
  const stateGenerator = new UserInterfacePopUpsReducerStates();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const UserInterfacePopUpsReducer = withMiddleware(
  userInterfacePopUpsReducer,
  middlewares
);
