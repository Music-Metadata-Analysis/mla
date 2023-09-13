import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerGenericResetFetch extends ReportReducerStateBaseClass<"StartFetch"> {
  type = "StartFetch" as const;

  generateState(): ReportStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: null,
      inProgress: true,
      profileUrl: null,
      ready: false,
      retries: this.state.retries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericResetFetch;
