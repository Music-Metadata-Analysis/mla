import type translations from "@locales/lastfm.json";
import type BaseReportState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { IntegrationRequestType } from "@src/types/analytics.types";
import type { LastFMReportInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type { FC } from "react";

export default abstract class LastFMReportAbstractBaseClass<
  ReportState extends BaseReportState,
  CompletedReportDataType,
  DrawerComponentProps
> implements
    LastFMReportInterface<
      ReportState,
      CompletedReportDataType,
      DrawerComponentProps
    >
{
  protected abstract analyticsReportType: IntegrationRequestType;
  protected abstract drawerComponent: FC<DrawerComponentProps>;
  protected abstract encapsulationClass:
    | (new (
        reportProperties: ReportState["userProperties"],
        t: tFunctionType
      ) => ReportState)
    | (new (reportProperties: ReportState["userProperties"]) => ReportState);
  protected abstract hookMethod:
    | "playCountByArtist"
    | "top20albums"
    | "top20artists"
    | "top20tracks";

  protected abstract retryRoute: string;
  protected abstract translationKey: keyof typeof translations;

  getAnalyticsReportType() {
    return this.analyticsReportType;
  }

  getDrawerComponent() {
    return this.drawerComponent;
  }

  getEncapsulatedReportState(
    reportProperties: ReportState["userProperties"],
    t?: tFunctionType
  ) {
    if (t) {
      return new (this.encapsulationClass as new (
        reportProperties: ReportState["userProperties"],
        t: tFunctionType
      ) => ReportState)(reportProperties, t);
    } else {
      return new (this.encapsulationClass as new (
        reportProperties: ReportState["userProperties"]
      ) => ReportState)(reportProperties);
    }
  }

  getHookMethod() {
    return this.hookMethod;
  }

  getRetryRoute() {
    return this.retryRoute;
  }

  getReportTranslationKey() {
    return this.translationKey;
  }

  queryIsDataReady(reportProperties: ReportState["userProperties"]) {
    if (reportProperties.inProgress) return false;
    if (reportProperties.ready) return false;
    if (reportProperties.error) return false;
    return true;
  }

  abstract queryUserHasNoData(
    reportProperties: ReportState["userProperties"]
  ): boolean;

  abstract getReportData(
    reportProperties: ReportState["userProperties"]
  ): CompletedReportDataType;

  startDataFetch(user: userHookAsLastFM, userName: string) {
    user[this.hookMethod](userName);
  }
}
