import { GenerateUserLink } from "../../config/lastfm";
import type { UserActionType } from "../../types/user/action.types";
import type { UserStateInterface } from "../../types/user/state.types";

class UserReducerStates {
  wrongTypeError = "Received wrong action type.";
  initialReport = {
    artists: [],
    albums: [],
    image: [],
  };

  FailureFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "FailureFetchUser") {
      return {
        data: { integration: action.integration, report: this.initialReport },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  NotFoundFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "NotFoundFetchUser") {
      return {
        data: { integration: action.integration, report: this.initialReport },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  RatelimitedFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "RatelimitedFetchUser") {
      return {
        data: { integration: action.integration, report: this.initialReport },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ReadyFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "ReadyFetchUser") {
      return {
        data: { integration: action.integration, report: action.data },
        error: null,
        inProgress: false,
        profileUrl: GenerateUserLink(action.userName),
        ready: true,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ResetState(action: UserActionType): UserStateInterface {
    if (action.type === "ResetState") {
      return {
        data: { integration: null, report: this.initialReport },
        error: null,
        inProgress: false,
        profileUrl: null,
        ready: true,
        userName: null,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  SuccessFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "SuccessFetchUser") {
      return {
        data: { integration: action.integration, report: action.data },
        error: null,
        inProgress: false,
        profileUrl: null,
        ready: false,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  StartFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "StartFetchUser") {
      return {
        data: { integration: action.integration, report: this.initialReport },
        error: null,
        inProgress: true,
        profileUrl: null,
        ready: false,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  UnauthorizedFetchUser(action: UserActionType): UserStateInterface {
    if (action.type === "UnauthorizedFetchUser") {
      return {
        data: { integration: action.integration, report: this.initialReport },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default UserReducerStates;
