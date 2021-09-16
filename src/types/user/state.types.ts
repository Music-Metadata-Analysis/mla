import type { UserReportType } from "./report.types";

interface UserDataInterface {
  integration: string | null;
  report: UserReportType;
}

export interface UserStateInterface {
  data: UserDataInterface;
  error: boolean;
  inProgress: boolean;
  profileUrl: string | null;
  ratelimited: boolean;
  ready: boolean;
  userName: string | null;
}
