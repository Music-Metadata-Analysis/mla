import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerDataPointTimeoutFetch extends ReportReducerStateBaseClass<"DataPointTimeoutFetch"> {
  type = "DataPointTimeoutFetch" as const;

  generateState(): ReportStateInterface {
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
