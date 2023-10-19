import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerCacheFailureRetrive extends ReportReducerStateBaseClass<"FailureRetrieveCachedReport"> {
  type = "FailureRetrieveCachedReport" as const;

  generateState(): ReportStateInterface {
    return {
      data: { ...this.state.data },
      error: this.type,
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: false,
      retries: this.state.retries,
      userName: this.state.userName,
    };
  }
}

export default ReducerCacheFailureRetrive;
