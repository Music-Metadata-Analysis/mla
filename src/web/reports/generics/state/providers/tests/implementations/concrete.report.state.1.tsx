import UserReducerStateBase from "../../states/report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export default class ConcreteStateOne extends UserReducerStateBase<"ReadyFetch"> {
  type = "ReadyFetch" as const;
  generateState(): ReportStateInterface {
    return mockReadyState as unknown as ReportStateInterface;
  }
}

export const mockReadyState = "mockReadyState";
