import UserReducerStateBase from "../../states/report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export default class ConcreteStateThree extends UserReducerStateBase<"StartFetch"> {
  type = "StartFetch" as const;
  generateState(): ReportStateInterface {
    return mockStartState as unknown as ReportStateInterface;
  }
}

export const mockStartState = "mockStartState";
