import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerGenericResetFetch extends ReducerStateBaseClass<"StartFetch"> {
  type = "StartFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: null,
      inProgress: true,
      profileUrl: null,
      ready: false,
      retries: this.state.retries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericResetFetch;
