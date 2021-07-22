import UserReducerStates from "./user.reducer.states.class";
import reducerLoggingMiddleware from "../../utils/reducer.logger";
import withMiddleware from "../../utils/reducer.middleware";
import type { UserActionType } from "../../types/user/action.types";
import type { UserStateInterface } from "../../types/user/state.types";

const userReducer = (state: UserStateInterface, action: UserActionType) => {
  const stateMethod = action.type;
  const stateGenerator = new UserReducerStates();
  const newState = stateGenerator[stateMethod](action);
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const UserReducer = withMiddleware(userReducer, middlewares);
