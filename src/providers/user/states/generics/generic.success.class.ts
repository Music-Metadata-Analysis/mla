import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerGenericSuccessFetch extends ReducerStateBaseClass<"SuccessFetch"> {
  type = "SuccessFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.action.data,
      },
      error: null,
      inProgress: false,
      profileUrl: null,
      ready: false,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericSuccessFetch;
