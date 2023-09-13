import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerDataPointSuccessFetch extends ReportReducerStateBaseClass<"DataPointSuccessFetch"> {
  type = "DataPointSuccessFetch" as const;

  generateState(): ReportStateInterface {
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
