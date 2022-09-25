import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerDataPointSuccessFetch extends ReducerStateBaseClass<"DataPointSuccessFetch"> {
  type = "DataPointSuccessFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.state.data.integration,
        report: this.action.data,
      },
      error: null,
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.initialRetries,
      userName: this.state.userName,
    };
  }
}

export default ReducerDataPointSuccessFetch;
