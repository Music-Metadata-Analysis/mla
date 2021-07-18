import { GenerateUserLink } from "../../config/lastfm";
import reducerLoggingMiddleware from "../../utils/reducer.logger";
import withMiddleware from "../../utils/reducer.middleware";
import type {
  UserStateInterface,
  UserActionType,
} from "../../types/user.types";

const userReducer = (state: UserStateInterface, action: UserActionType) => {
  switch (action.type) {
    case "ResetState":
      return {
        ...state,
        data: {},
        error: false,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: "",
      };
    case "StartFetchUser":
      return {
        ...state,
        data: {},
        error: false,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: action.userName,
      };
    case "FailureFetchUser":
      return {
        ...state,
        data: {},
        error: true,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: action.userName,
      };
    case "RatelimitedFetchUser":
      return {
        ...state,
        data: {},
        error: true,
        profileUrl: null,
        ratelimited: true,
        ready: false,
        userName: action.userName,
      };
    case "SuccessFetchUser":
      return {
        data: action.data,
        error: false,
        profileUrl: GenerateUserLink(action.userName),
        ratelimited: false,
        ready: true,
        userName: action.userName,
      };
    default:
      return state;
  }
};

const middlewares = [reducerLoggingMiddleware];
export const UserReducer = withMiddleware(userReducer, middlewares);
