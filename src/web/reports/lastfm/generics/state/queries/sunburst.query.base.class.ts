import SunBurstStateToChartDataTranslator from "@src/web/reports/lastfm/generics/components/report.component/sunburst/translator/translator.class";
import LastFMReportQueryAbstractBaseClass from "@src/web/reports/lastfm/generics/state/queries/bases/query.base.class";
import type translations from "@locales/lastfm.json";
import type { LastFMReportClientParamsInterface } from "@src/contracts/api/types/clients/lastfm.client.types";
import type { GenericAggregateReportOperationType } from "@src/contracts/api/types/services/generics/aggregates/generic.aggregate.report.types";
import type { SunBurstData } from "@src/contracts/api/types/services/generics/aggregates/generic.sunburst.types";
import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { d3Node } from "@src/web/reports/generics/types/state/charts/sunburst.types";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type LastFMReportSunBurstBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type { SunBurstReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/sunburst.types";
import type { FC } from "react";

type AggregateReportContent = {
  [key in SunBurstData["entity"]]: unknown[];
} & { playcount: number; name: string };

export default abstract class SunBurstBaseQuery<
    ReportStateEncapsulation extends LastFMReportSunBurstBaseStateEncapsulation<unknown>
  >
  extends LastFMReportQueryAbstractBaseClass<
    ReportStateEncapsulation,
    LastFMAggregateReportResponseInterface<unknown[]>,
    LastFMSunBurstDrawerInterface
  >
  implements
    SunBurstReportStateQueryInterface<
      ReportStateEncapsulation,
      LastFMAggregateReportResponseInterface<unknown[]>,
      LastFMSunBurstDrawerInterface
    >
{
  protected abstract drawerComponent: FC<LastFMSunBurstDrawerInterface>;
  protected abstract encapsulationClass: new (
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) => ReportStateEncapsulation;
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

  getProgressPercentage(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) {
    if (this.getReportData(reportProperties).status.complete) return 100;
    const complete = this.getReportData(reportProperties).status.steps_complete;
    const total = this.getReportData(reportProperties).status.steps_total;
    const percentage = Math.floor((complete / total) * 100);
    if (isNaN(percentage)) return 0;
    return percentage;
  }

  getProgressDetails(
    reportProperties: ReportStateEncapsulation["reportProperties"],
    t: tFunctionType
  ) {
    if (!this.getReportData(reportProperties).status.operation)
      return { resource: "", type: "" };
    const resource = (
      this.getReportData(reportProperties).status
        .operation as GenericAggregateReportOperationType<LastFMReportClientParamsInterface>
    ).resource;
    const type = (
      this.getReportData(reportProperties).status
        .operation as GenericAggregateReportOperationType<LastFMReportClientParamsInterface>
    ).type;
    return {
      resource,
      type: t(`detailTypes.${type}`),
    };
  }

  getSunBurstData(
    reportProperties: ReportStateEncapsulation["reportProperties"],
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

  queryIsDataReady(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) {
    if (!this.getReportData(reportProperties).status.complete) return false;
    return super.queryIsDataReady(reportProperties);
  }

  queryIsResumable(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) {
    const canBeResumed =
      reportProperties.inProgress === false &&
      reportProperties.ready === false &&
      this.getReportData(reportProperties).status.complete !== true;

    if (
      reportProperties.error === null ||
      reportProperties.error === "FailureRetrieveCachedReport" ||
      reportProperties.error === "TimeoutFetch" ||
      reportProperties.error.startsWith("DataPoint")
    ) {
      return canBeResumed;
    }
    return false;
  }

  queryUserHasNoData(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) {
    return (
      reportProperties.ready &&
      reportProperties.userName !== null &&
      this.getReportData(reportProperties).content.length === 0
    );
  }

  abstract getReportData(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ): LastFMAggregateReportResponseInterface<unknown[]>;

  startDataFetch(user: reportHookAsLastFM, userName: string) {
    super.startDataFetch(user, userName);
  }
}
