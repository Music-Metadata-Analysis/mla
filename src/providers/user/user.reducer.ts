import withMiddleware from "../../utils/reducer.middleware";
import reducerLoggingMiddleware from "../../utils/reducer.logger";
import { GenerateUserLink } from "../../config/lastfm";

import { UserStateInterface, UserActionType } from "../../types/user.types";

const userReducer = (state: UserStateInterface, action: UserActionType) => {
  switch (action.type) {
    case "ResetState":
      return {
        ...state,
        userName: "",
        profileUrl: null,
        data: {},
        error: false,
        ready: false,
      };
    case "StartFetchUser":
      return {
        ...state,
        userName: action.userName,
        error: false,
        ready: false,
      };
    case "FailureFetchUser":
      return {
        ...state,
        userName: action.userName,
        profileUrl: null,
        data: {},
        error: true,
        ready: false,
      };
    case "SuccessFetchUser":
      return {
        userName: action.userName,
        profileUrl: GenerateUserLink(action.userName),
        data: action.data,
        error: false,
        ready: true,
      };
    default:
      return state;
  }
};

const middlewares = [reducerLoggingMiddleware];
export const UserReducer = withMiddleware(userReducer, middlewares);
