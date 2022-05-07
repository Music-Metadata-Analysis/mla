import type { userHookAsLastFM } from "../../../user/hook.types";

export interface LastFMReportClassInterface<UserPropertiesType, ReportType> {
  getRetryRoute(): string;
  getReportTranslationKey(): string;
  queryIsDataReady(userProperties: UserPropertiesType): boolean;
  queryUserHasData(userProperties: UserPropertiesType): boolean;
  startDataFetch(user: userHookAsLastFM, userName: string): void;
  getReportData(userProperties: UserPropertiesType): ReportType;
}
