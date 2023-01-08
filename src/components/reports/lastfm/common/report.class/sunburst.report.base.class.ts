import LastFMReportQueryAbstractBaseClass from "@src/components/reports/lastfm/common/report.class/bases/report.base.class";
import SunBurstStateToChartDataTranslator from "@src/components/reports/lastfm/common/report.component/sunburst/translator/translator.class";
import type translations from "@locales/lastfm.json";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type UserState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/reports/generics/aggregate.types";
import type {
  d3Node,
  SunBurstData,
} from "@src/types/reports/generics/sunburst.types";
import type { LastFMSunBurstDrawerInterface } from "@src/types/reports/lastfm/components/drawers/sunburst.types";
import type { SunBurstReportStateQueryInterface } from "@src/types/reports/lastfm/states/queries/sunburst.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type { FC } from "react";

type AggregateReportContent = {
  [key in SunBurstData["entity"]]: unknown[];
} & { playcount: number; name: string };

export default abstract class SunBurstBaseReport<
    ReportState extends UserState<unknown>
  >
  extends LastFMReportQueryAbstractBaseClass<
    ReportState,
    AggregateBaseReportResponseInterface<unknown[]>,
    LastFMSunBurstDrawerInterface
  >
  implements
    SunBurstReportStateQueryInterface<
      ReportState,
      AggregateBaseReportResponseInterface<unknown[]>,
      LastFMSunBurstDrawerInterface
    >
{
  protected abstract drawerComponent: FC<LastFMSunBurstDrawerInterface>;
  protected abstract encapsulationClass: new (
    reportProperties: ReportState["userProperties"]
  ) => ReportState;
  protected abstract entityKeys: Array<SunBurstData["entity"]>; // Order: Toplevel, Intermediary..., Leaf
  protected abstract hookMethod: "playCountByArtist";
  protected abstract nodeEncapsulationClass: new (
    node: d3Node,
    leafEntity: SunBurstData["entity"]
  ) => SunBurstNodeAbstractBase;
  protected abstract translationKey: keyof typeof translations;

  getEncapsulatedNode(node: d3Node) {
    return new this.nodeEncapsulationClass(node, this.getEntityLeaf());
  }

  getEntities() {
    return this.entityKeys;
  }

  getEntityLeaf() {
    return this.entityKeys[
      this.entityKeys.length - 1
    ] as SunBurstData["entity"];
  }

  getEntityTopLevel() {
    return this.entityKeys[0] as SunBurstData["entity"];
  }

  getProgressPercentage(reportProperties: ReportState["userProperties"]) {
    if (this.getReportData(reportProperties).status.complete) return 100;
    const complete = this.getReportData(reportProperties).status.steps_complete;
    const total = this.getReportData(reportProperties).status.steps_total;
    const percentage = Math.floor((complete / total) * 100);
    if (isNaN(percentage)) return 0;
    return percentage;
  }

  getProgressDetails(
    reportProperties: ReportState["userProperties"],
    t: tFunctionType
  ) {
    if (!this.getReportData(reportProperties).status.operation)
      return { resource: "", type: "" };
    const resource = this.getReportData(reportProperties).status.operation
      ?.resource as string;
    const type = this.getReportData(reportProperties).status.operation
      ?.type as string;
    return {
      resource,
      type: t(`detailTypes.${type}`),
    };
  }

  getSunBurstData(
    reportProperties: ReportState["userProperties"],
    rootTag: string,
    remainderTag: string
  ): SunBurstData {
    const rootNode = {
      name: rootTag,
      entity: "root" as const,
      value: reportProperties.data.report.playcount,
      children: [],
    };
    const translator = new SunBurstStateToChartDataTranslator(
      this.entityKeys,
      remainderTag
    );
    const result = translator.convert(
      rootNode,
      this.getReportData(reportProperties).content as AggregateReportContent[],
      this.getEntityTopLevel()
    );
    return result;
  }

  queryIsDataReady(reportProperties: ReportState["userProperties"]) {
    if (!this.getReportData(reportProperties).status.complete) return false;
    return super.queryIsDataReady(reportProperties);
  }

  queryIsResumable(reportProperties: ReportState["userProperties"]) {
    const canBeResumed =
      reportProperties.inProgress === false &&
      reportProperties.ready === false &&
      this.getReportData(reportProperties).status.complete !== true;

    if (
      reportProperties.error === null ||
      reportProperties.error === "TimeoutFetch" ||
      reportProperties.error.startsWith("DataPoint")
    ) {
      return canBeResumed;
    }
    return false;
  }

  queryUserHasNoData(reportProperties: ReportState["userProperties"]) {
    return (
      reportProperties.ready &&
      reportProperties.userName !== null &&
      this.getReportData(reportProperties).content.length === 0
    );
  }

  abstract getReportData(
    reportProperties: ReportState["userProperties"]
  ): AggregateBaseReportResponseInterface<unknown[]>;

  startDataFetch(user: userHookAsLastFM, userName: string) {
    // TODO: attach caching here
    super.startDataFetch(user, userName);
  }
}
