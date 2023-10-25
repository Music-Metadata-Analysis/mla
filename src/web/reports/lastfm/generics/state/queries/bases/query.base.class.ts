import type translations from "@locales/lastfm.json";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type LastFMReportBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type { LastFMReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/base.types";
import type { FC } from "react";

export default abstract class LastFMReportQueryAbstractBaseClass<
  ReportStateEncapsulation extends LastFMReportBaseStateEncapsulation,
  CompletedReportDataType,
  DrawerComponentProps,
> implements
    LastFMReportStateQueryInterface<
      ReportStateEncapsulation,
      CompletedReportDataType,
      DrawerComponentProps
    >
{
  protected abstract analyticsReportType: IntegrationRequestType;
  protected abstract drawerComponent: FC<DrawerComponentProps>;
  protected abstract encapsulationClass:
    | (new (
        reportProperties: ReportStateEncapsulation["reportProperties"],
        t: tFunctionType
      ) => ReportStateEncapsulation)
    | (new (
        reportProperties: ReportStateEncapsulation["reportProperties"]
      ) => ReportStateEncapsulation);
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
    reportProperties: ReportStateEncapsulation["reportProperties"],
    t?: tFunctionType
  ) {
    if (t) {
      return new (this.encapsulationClass as new (
        reportProperties: ReportStateEncapsulation["reportProperties"],
        t: tFunctionType
      ) => ReportStateEncapsulation)(reportProperties, t);
    } else {
      return new (this.encapsulationClass as new (
        reportProperties: ReportStateEncapsulation["reportProperties"]
      ) => ReportStateEncapsulation)(reportProperties);
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

  queryIsDataReady(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) {
    if (reportProperties.inProgress) return false;
    if (reportProperties.ready) return false;
    if (reportProperties.error) return false;
    return true;
  }

  abstract queryUserHasNoData(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ): boolean;

  abstract getReportData(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ): CompletedReportDataType;

  startDataFetch(user: reportHookAsLastFM, userName: string) {
    user[this.hookMethod](userName);
  }
}
