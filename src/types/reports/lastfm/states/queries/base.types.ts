import type translations from "@locales/lastfm.json";
import type { ImagesControllerHookType } from "@src/hooks/controllers/images.controller.hook";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { IntegrationRequestType } from "@src/types/analytics.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { FC } from "react";

export interface LastFMReportStateQueryInterface<
  ReportState extends ReportBaseState,
  CompletedReportDataType,
  DrawerComponentProps
> {
  getAnalyticsReportType(): IntegrationRequestType;

  getDrawerComponent(): FC<DrawerComponentProps>;

  getEncapsulatedReportState(
    reportProperties: ReportState["userProperties"],
    t?: tFunctionType
  ): ReportState;

  getHookMethod(): string;

  getRetryRoute(): string;

  getReportTranslationKey(): keyof typeof translations;

  queryIsDataReady(reportProperties: ReportState["userProperties"]): boolean;

  queryIsImagesLoaded?: (
    reportProperties: ReportState["userProperties"],
    imagesController: ImagesControllerHookType
  ) => boolean;

  queryUserHasNoData(reportProperties: ReportState["userProperties"]): boolean;

  startDataFetch(user: userHookAsLastFM, userName: string): void;

  getReportData(
    reportProperties: ReportState["userProperties"]
  ): CompletedReportDataType;
}
