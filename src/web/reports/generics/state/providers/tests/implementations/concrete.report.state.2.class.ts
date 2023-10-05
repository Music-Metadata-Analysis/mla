import UserReducerStateBase from "../../states/report.reducer.states.base.class";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

export default class ConcreteStateTwo extends UserReducerStateBase<"ResetState"> {
  type = "ResetState" as const;
  generateState(): ReportStateInterface {
    return mockResetState as unknown as ReportStateInterface;
  }
}

export const mockResetState = "mockResetState";
