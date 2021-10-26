import { InitialState } from "./user.initial";
import { GenerateUserLink } from "../../config/lastfm";
import type { UserActionType } from "../../types/user/action.types";
import type { UserStateInterface } from "../../types/user/state.types";

class UserReducerStates {
  wrongTypeError = "Received wrong action type.";
  initialReport = { ...InitialState.data.report };
  initalRetries = InitialState.retries;

  FailureFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "FailureFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: this.initialReport,
        },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        retries: this.initalRetries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  NotFoundFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "NotFoundFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: this.initialReport,
        },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        retries: this.initalRetries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  RatelimitedFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "RatelimitedFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: this.initialReport,
        },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        retries: this.initalRetries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ReadyFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "ReadyFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: action.data,
        },
        error: null,
        inProgress: false,
        profileUrl: GenerateUserLink(action.userName),
        ready: true,
        retries: this.initalRetries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ResetState(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "ResetState") {
      return {
        data: {
          integration: null,
          report: this.initialReport,
        },
        error: null,
        inProgress: false,
        profileUrl: null,
        ready: true,
        retries: this.initalRetries,
        userName: null,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  StartFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "StartFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: this.initialReport,
        },
        error: null,
        inProgress: true,
        profileUrl: null,
        ready: false,
        retries: state.retries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  SuccessFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "SuccessFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: action.data,
        },
        error: null,
        inProgress: false,
        profileUrl: null,
        ready: false,
        retries: this.initalRetries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  TimeoutFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "TimeoutFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: this.initialReport,
        },
        error: state.retries > 0 ? action.type : "FailureFetchUser",
        inProgress: false,
        profileUrl: null,
        ready: state.retries > 0 ? false : true,
        retries: state.retries > 0 ? state.retries - 1 : 0,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
  UnauthorizedFetchUser(
    state: UserStateInterface,
    action: UserActionType
  ): UserStateInterface {
    if (action.type === "UnauthorizedFetchUser") {
      return {
        data: {
          integration: action.integration,
          report: this.initialReport,
        },
        error: action.type,
        inProgress: false,
        profileUrl: null,
        ready: true,
        retries: this.initalRetries,
        userName: action.userName,
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default UserReducerStates;
