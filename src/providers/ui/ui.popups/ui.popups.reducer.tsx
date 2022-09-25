import UserInterfacePopUpsReducerStates from "./ui.popups.reducer.states.class";
import reducerLoggingMiddleware from "@src/utils/reducer.logger";
import withMiddleware from "@src/utils/reducer.middleware";
import type { UserInterfacePopUpsActionType } from "@src/types/ui/popups/ui.popups.action.types";
import type { UserInterfacePopUpsStateInterface } from "@src/types/ui/popups/ui.popups.state.types";

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
export const UserInterfacePopUpsReducer = withMiddleware<
  UserInterfacePopUpsStateInterface,
  UserInterfacePopUpsActionType
>(userInterfacePopUpsReducer, middlewares);
