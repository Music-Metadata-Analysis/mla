import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerDataPointFailureFetch extends ReducerStateBaseClass<"DataPointFailureFetch"> {
  type = "DataPointFailureFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        report: this.action.data,
        integration: this.state.data.integration,
      },
      error: this.action.type,
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.initialRetries,
      userName: this.state.userName,
    };
  }
}

export default ReducerDataPointFailureFetch;
