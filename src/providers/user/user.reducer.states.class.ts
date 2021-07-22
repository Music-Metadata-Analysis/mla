import { GenerateUserLink } from "../../config/lastfm";
import type { UserActionType } from "../../types/user/action.types";
import type { UserStateInterface } from "../../types/user/state.types";

class UserReducerStates {
  wrongTypeError = "Received wrong action type.";

  FailureFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "FailureFetchUser") {
      return {
        data: { integration: action.integration, report: {} },
        error: true,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  StartFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "StartFetchUser") {
      return {
        data: { integration: action.integration, report: {} },
        error: false,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  SuccessFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "SuccessFetchUser") {
      return {
        data: { integration: action.integration, report: action.data },
        error: false,
        profileUrl: GenerateUserLink(action.userName),
        ratelimited: false,
        ready: true,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ResetState(action: UserActionType): UserStateInterface {
    if (action.type === "ResetState") {
      return {
        data: { integration: null, report: {} },
        error: false,
        profileUrl: null,
        ratelimited: false,
        ready: false,
        userName: null,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  RatelimitedFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "RatelimitedFetchUser") {
      return {
        data: { integration: action.integration, report: {} },
        error: true,
        profileUrl: null,
        ratelimited: true,
        ready: false,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default UserReducerStates;
