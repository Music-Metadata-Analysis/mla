import type translations from "@locales/lastfm.json";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { IntegrationRequestType } from "@src/web/analytics/collection/types/analytics.types";
import type LastFMReportBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/bases/lastfm.report.encapsulation.base.class";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type { ImagesControllerHookType } from "@src/web/ui/images/state/controllers/images.controller.hook";
import type { FC } from "react";

export interface LastFMReportStateQueryInterface<
  ReportEncapsulation extends LastFMReportBaseStateEncapsulation,
  CompletedReportDataType,
  DrawerComponentProps,
> {
  getAnalyticsReportType(): IntegrationRequestType;

  getDrawerComponent(): FC<DrawerComponentProps>;

  getEncapsulatedReportState(
    reportProperties: ReportEncapsulation["reportProperties"],
    t?: tFunctionType
  ): ReportEncapsulation;

  getHookMethod(): string;

  getRetryRoute(): string;

  getReportTranslationKey(): keyof typeof translations;

  queryIsDataReady(
    reportProperties: ReportEncapsulation["reportProperties"]
  ): boolean;

  queryIsImagesLoaded?: (
    reportProperties: ReportEncapsulation["reportProperties"],
    imagesController: ImagesControllerHookType
  ) => boolean;

  queryUserHasNoData(
    reportProperties: ReportEncapsulation["reportProperties"]
  ): boolean;

  startDataFetch(user: reportHookAsLastFM, userName: string): void;

  getReportData(
    reportProperties: ReportEncapsulation["reportProperties"]
  ): CompletedReportDataType;
}
