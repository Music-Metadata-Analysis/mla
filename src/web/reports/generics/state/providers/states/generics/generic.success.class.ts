import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerGenericSuccessFetch extends ReportReducerStateBaseClass<"SuccessFetch"> {
  type = "SuccessFetch" as const;

  generateState(): ReportStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.action.data,
      },
      error: null,
      inProgress: false,
      profileUrl: null,
      ready: false,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericSuccessFetch;
