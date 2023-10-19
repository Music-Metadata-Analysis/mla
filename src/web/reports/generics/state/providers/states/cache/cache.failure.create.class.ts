import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerCacheFailureCreate extends ReportReducerStateBaseClass<"FailureCreateCachedReport"> {
  type = "FailureCreateCachedReport" as const;

  generateState(): ReportStateInterface {
    return {
      data: { ...this.state.data },
      error: null,
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.state.retries,
      userName: this.state.userName,
    };
  }
}

export default ReducerCacheFailureCreate;
