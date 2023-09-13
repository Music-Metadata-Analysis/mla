import type { ReportActionType } from "./report.action.types";
import type { ReportStateInterface } from "./report.state.types";

export type reportDispatchType = (action: ReportActionType) => void;

export interface ReportContextInterface {
  reportProperties: ReportStateInterface;
  dispatch: reportDispatchType;
}
