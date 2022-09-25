import type translations from "@locales/lastfm.json";
import type { userHookAsLastFM } from "@src/types/user/hook.types";

export interface LastFMReportClassInterface<UserPropertiesType, ReportType> {
  getRetryRoute(): string;
  getReportTranslationKey(): keyof typeof translations;
  queryIsDataReady(userProperties: UserPropertiesType): boolean;
  queryUserHasData(userProperties: UserPropertiesType): boolean;
  startDataFetch(user: userHookAsLastFM, userName: string): void;
  getReportData(userProperties: UserPropertiesType): ReportType;
}
