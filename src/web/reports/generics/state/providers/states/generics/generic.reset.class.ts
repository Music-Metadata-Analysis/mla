import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerGenericResetFetch extends ReportReducerStateBaseClass<"ResetState"> {
  type = "ResetState" as const;

  generateState(): ReportStateInterface {
    return {
      data: {
        integration: null,
        report: this.initialReport,
      },
      error: null,
      inProgress: false,
      profileUrl: null,
      ready: true,
      retries: this.initialRetries,
      userName: null,
    };
  }
}

export default ReducerGenericResetFetch;
