import ReportReducerStateBaseClass from "../report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

class ReducerCacheSuccessRetrieve extends ReportReducerStateBaseClass<"SuccessRetrieveCachedReport"> {
  type = "SuccessRetrieveCachedReport" as const;

  generateState(): ReportStateInterface {
    return {
      ...this.action.cachedReportState,
      retries: this.state.retries,
    };
  }
}

export default ReducerCacheSuccessRetrieve;
