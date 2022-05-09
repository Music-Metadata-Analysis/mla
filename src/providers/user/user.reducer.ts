import getReducerStates from "./states/user.reducer.states";
import reducerLoggingMiddleware from "../../utils/reducer.logger";
import withMiddleware from "../../utils/reducer.middleware";
import type { UserActionType } from "../../types/user/action.types";
import type { UserStateInterface } from "../../types/user/state.types";

const userReducer = (state: UserStateInterface, action: UserActionType) => {
  let newState = state;
  getReducerStates().forEach((reducerStateClass) => {
    const reducerState = new reducerStateClass(newState, action);
    newState = reducerState.apply();
  });
  return newState;
};

const middlewares = [reducerLoggingMiddleware];
export const UserReducer = withMiddleware<UserStateInterface, UserActionType>(
  userReducer,
  middlewares
);
