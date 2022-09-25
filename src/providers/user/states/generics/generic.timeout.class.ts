import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerGenericTimeoutFetch extends ReducerStateBaseClass<"TimeoutFetch"> {
  type = "TimeoutFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: this.state.retries > 0 ? this.action.type : "FailureFetch",
      inProgress: false,
      profileUrl: null,
      ready: this.state.retries > 0 ? false : true,
      retries: this.state.retries > 0 ? this.state.retries - 1 : 0,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericTimeoutFetch;
