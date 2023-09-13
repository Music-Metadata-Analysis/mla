import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerDataPointStartFetch extends ReportReducerStateBaseClass<"DataPointStartFetch"> {
  type = "DataPointStartFetch" as const;

  generateState(): ReportStateInterface {
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
