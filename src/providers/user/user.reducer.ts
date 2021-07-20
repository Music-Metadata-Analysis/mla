import { GenerateUserLink } from "../../config/lastfm";
import reducerLoggingMiddleware from "../../utils/reducer.logger";
import withMiddleware from "../../utils/reducer.middleware";
import type { UserActionType } from "../../types/user/action.types";
import type { UserStateInterface } from "../../types/user/state.types";

const userReducer = (state: UserStateInterface, action: UserActionType) => {
  switch (action.type) {
    case "ResetState":
      return {
        ...state,
        data: { integration: null, report: {} },
        error: false,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: "",
      };
    case "StartFetchUser":
      return {
        ...state,
        data: { integration: action.integration, report: {} },
        error: false,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: action.userName,
      };
    case "FailureFetchUser":
      return {
        ...state,
        data: { integration: action.integration, report: {} },
        error: true,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: action.userName,
      };
    case "RatelimitedFetchUser":
      return {
        ...state,
        data: { integration: action.integration, report: {} },
        error: true,
        profileUrl: null,
        ratelimited: true,
        ready: false,
        userName: action.userName,
      };
    case "SuccessFetchUser":
      return {
        data: { integration: action.integration, report: action.data },
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
