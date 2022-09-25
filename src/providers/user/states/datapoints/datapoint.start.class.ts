import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerDataPointStartFetch extends ReducerStateBaseClass<"DataPointStartFetch"> {
  type = "DataPointStartFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: this.state.data,
      error: null,
      inProgress: true,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.initialRetries,
      userName: this.state.userName,
    };
  }
}

export default ReducerDataPointStartFetch;
