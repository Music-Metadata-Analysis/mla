import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerGenericReadyFetch extends ReportReducerStateBaseClass<"ReadyFetch"> {
  type = "ReadyFetch" as const;

  generateState(): ReportStateInterface {
    return {
      data: { ...this.state.data },
      error: null,
      inProgress: false,
      profileUrl: this.state.profileUrl,
      ready: true,
      retries: this.initialRetries,
      userName: this.state.userName,
    };
  }
}

export default ReducerGenericReadyFetch;
