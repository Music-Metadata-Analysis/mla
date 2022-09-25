import ReducerStateBaseClass from "../user.reducer.states.base.class";
import type { UserStateInterface } from "@src/types/user/state.types";

class ReducerDataPointTimeoutFetch extends ReducerStateBaseClass<"DataPointTimeoutFetch"> {
  type = "DataPointTimeoutFetch" as const;

  generateState(): UserStateInterface {
    return {
      data: {
        integration: this.state.data.integration,
        report: this.state.data.report,
      },
      error:
        this.state.retries > 0 ? this.action.type : "DataPointFailureFetch",
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.state.retries > 0 ? this.state.retries - 1 : 0,
      userName: this.state.userName,
    };
  }
}

export default ReducerDataPointTimeoutFetch;
