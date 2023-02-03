import { InitialState } from "../report.initial";
import type { UserActionType } from "@src/types/user/action.types";
import type { UserStateInterface } from "@src/types/user/state.types";

abstract class ReducerStateBaseClass<T extends UserActionType["type"]> {
  wrongTypeError = "Received wrong action type.";
  initialReport = JSON.parse(JSON.stringify(InitialState.data.report));
  initialRetries = InitialState.retries;
  state: UserStateInterface;
  action: UserActionType & { type: T };
  abstract type: UserActionType["type"];

  constructor(state: UserStateInterface, action: UserActionType) {
    this.state = state;
    this.action = action as UserActionType & { type: T };
  }

  apply(): UserStateInterface {
    if (this.action.type === this.type) return this.generateState();
    return this.state;
  }

  abstract generateState(): UserStateInterface;
}

export default ReducerStateBaseClass;
