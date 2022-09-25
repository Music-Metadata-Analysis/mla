import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerGenericResetFetch extends ReducerStateBaseClass<"ResetState"> {
  type = "ResetState" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: null,
        report: this.initialReport,
      },
      error: null,
      inProgress: false,
      profileUrl: null,
      ready: true,
      retries: this.initialRetries,
      userName: null,
    };
  }
}

export default ReducerGenericResetFetch;
