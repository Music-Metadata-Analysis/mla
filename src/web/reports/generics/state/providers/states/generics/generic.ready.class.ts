import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import { GenerateUserLink } from "@src/config/lastfm";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerGenericReadyFetch extends ReportReducerStateBaseClass<"ReadyFetch"> {
  type = "ReadyFetch" as const;

  generateState(): ReportStateInterface {
    return {
      data: {
        integration: this.action.integration,
        report: this.action.data,
      },
      error: null,
      inProgress: false,
      profileUrl: GenerateUserLink(this.action.userName),
      ready: true,
      retries: this.initialRetries,
      userName: this.action.userName,
    };
  }
}

export default ReducerGenericReadyFetch;
