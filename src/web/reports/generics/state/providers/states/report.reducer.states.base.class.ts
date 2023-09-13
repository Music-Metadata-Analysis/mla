import { InitialState } from "../report.initial";
import type { ReportActionType } from "@src/web/reports/generics/types/state/providers/report.action.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

abstract class ReportReducerStateBaseClass<T extends ReportActionType["type"]> {
  wrongTypeError = "Received wrong action type.";
  initialReport = JSON.parse(JSON.stringify(InitialState.data.report));
  initialRetries = InitialState.retries;
  state: ReportStateInterface;
  action: ReportActionType & { type: T };
  abstract type: ReportActionType["type"];

  constructor(state: ReportStateInterface, action: ReportActionType) {
    this.state = state;
    this.action = action as ReportActionType & { type: T };
  }

  apply(): ReportStateInterface {
    if (this.action.type === this.type) return this.generateState();
    return this.state;
  }

  abstract generateState(): ReportStateInterface;
}

export default ReportReducerStateBaseClass;
