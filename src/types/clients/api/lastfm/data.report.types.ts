import type translations from "@locales/lastfm.json";
import type { BillBoardProgressBarDetails } from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type SunBurstBaseNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { ImagesControllerHookType } from "@src/hooks/controllers/images.controller.hook";
import type ReportBaseState from "@src/providers/user/encapsulations/lastfm/user.state.base.class";
import type { IntegrationRequestType } from "@src/types/analytics.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { d3Node, SunBurstData } from "@src/types/reports/sunburst.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type { FC } from "react";

export interface LastFMReportInterface<
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

export interface FlipCardReportInterface<
  ReportState extends ReportBaseState,
  CompletedReportDataType,
  DrawerComponentProps
> extends LastFMReportInterface<
    ReportState,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getDrawerArtWorkAltTextTranslationKey(): string;
  getNumberOfImageLoads(
    reportProperties: ReportState["userProperties"]
  ): number;
}

export interface SunBurstReportInterface<
  ReportState extends ReportBaseState,
  CompletedReportDataType,
  DrawerComponentProps
> extends LastFMReportInterface<
    ReportState,
    CompletedReportDataType,
    DrawerComponentProps
  > {
  getEncapsulatedNode(node: d3Node): SunBurstBaseNodeEncapsulation;

  getEntities(): Array<SunBurstData["entity"]>;

  getEntityLeaf(): SunBurstData["entity"];

  getEntityTopLevel(): SunBurstData["entity"];

  getProgressPercentage(
    reportProperties: ReportState["userProperties"]
  ): number;

  getProgressDetails(
    reportProperties: ReportState["userProperties"],
    t: tFunctionType
  ): BillBoardProgressBarDetails;

  getSunBurstData(
    reportProperties: ReportState["userProperties"],
    rootTag: string,
    remainderTag: string
  ): SunBurstData;

  queryIsResumable(reportProperties: ReportState["userProperties"]): boolean;
}
