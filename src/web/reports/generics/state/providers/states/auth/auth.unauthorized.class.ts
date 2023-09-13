import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerAuthUnauthorized extends ReportReducerStateBaseClass<"UnauthorizedFetch"> {
  type = "UnauthorizedFetch" as const;

  generateState(): ReportStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.initialReport,
      },
      error: this.action.type,
      inProgress: false,
      profileUrl: null,
      ready: true,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerAuthUnauthorized;
