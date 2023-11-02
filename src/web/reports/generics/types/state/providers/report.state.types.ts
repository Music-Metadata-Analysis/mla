import type { ReportActionType } from "./report.action.types";
import type { ReportType } from "../generic.report.types";

interface ReportDataInterface {
  integration: string | null;
  report: ReportType;
}

export interface ReportStateInterface {
  data: ReportDataInterface;
  error: null | ReportActionType["type"];
  inProgress: boolean;
  profileUrl: string | null;
  ready: boolean;
  retries: number;
  userName: string | null;
}
