import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerGenericTimeoutFetch extends ReportReducerStateBaseClass<"TimeoutFetch"> {
  type = "TimeoutFetch" as const;

  generateState(): ReportStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: this.state.retries > 0 ? this.action.type : "FailureFetch",
      inProgress: false,
      profileUrl: null,
      ready: false,
      retries: this.state.retries > 0 ? this.state.retries - 1 : 0,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericTimeoutFetch;
