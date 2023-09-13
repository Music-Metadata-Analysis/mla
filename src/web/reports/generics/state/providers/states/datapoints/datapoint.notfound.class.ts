import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerDataPointNotFoundFetch extends ReportReducerStateBaseClass<"DataPointNotFoundFetch"> {
  type = "DataPointNotFoundFetch" as const;

  generateState(): ReportStateInterface {
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

export default ReducerDataPointNotFoundFetch;
