import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "../../../../types/user/state.types";

class ReducerDataPointRatelimitedFetch extends ReducerStateBaseClass<"DataPointRatelimitedFetch"> {
  type = "DataPointRatelimitedFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: this.state.data,
      error: this.action.type,
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.initialRetries,
      userName: this.state.userName,
    };
  }
}

export default ReducerDataPointRatelimitedFetch;
