import getReducerStates from "./states/user.reducer.states";
import reducerLoggingMiddleware from "@src/utilities/react/state/reducers/reducer.logger";
import withMiddleware from "@src/utilities/react/state/reducers/reducer.middleware";
import type { UserActionType } from "@src/types/user/action.types";
import type { UserStateInterface } from "@src/types/user/state.types";

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
