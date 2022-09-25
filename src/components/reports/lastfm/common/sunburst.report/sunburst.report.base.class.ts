import SunBurstDataTranslator from "./chart/chart.data.class";
import type SunBurstNodeEncapsulation from "./encapsulations/sunburst.node.encapsulation.base";
import type translations from "@locales/lastfm.json";
import type { LastFMSunBurstDrawerInterface } from "@src/components/reports/lastfm/common/sunburst.report.drawer/sunburst.report.drawer.component";
import type UserState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { IntegrationRequestType } from "@src/types/analytics.types";
import type { LastFMReportClassInterface } from "@src/types/clients/api/lastfm/data.report.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";
import type { d3Node, SunBurstData } from "@src/types/reports/sunburst.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type { FC } from "react";

type AggregateReportContent = {
  [key in SunBurstData["entity"]]: unknown[];
} & { playcount: number; name: string };

export default abstract class SunBurstBaseReport<T extends UserState<unknown>>
  implements
    LastFMReportClassInterface<
      T["userProperties"],
      AggregateBaseReportResponseInterface<unknown[]>
    >
{
  abstract encapsulationClass: new (userProperties: T["userProperties"]) => T;
  abstract drawerComponent: FC<LastFMSunBurstDrawerInterface>;
  abstract nodeEncapsulationClass: new (
    node: d3Node,
    leafEntity: SunBurstData["entity"]
  ) => SunBurstNodeEncapsulation;
  abstract analyticsReportType: IntegrationRequestType;
  abstract retryRoute: string;
  abstract translationKey: keyof typeof translations;
  abstract hookMethod: "playCountByArtist";
  abstract entityKeys: SunBurstData["entity"][]; // Order: Toplevel, Intermediary..., Leaf

  getDrawerComponent() {
    return this.drawerComponent;
  }

  getEncapsulatedNode(node: d3Node) {
    return new this.nodeEncapsulationClass(node, this.getEntityLeaf());
  }

  getEncapsulatedUserState(userProperties: T["userProperties"]) {
    return new this.encapsulationClass(userProperties);
  }

  getEntityLeaf() {
    return this.entityKeys[
      this.entityKeys.length - 1
    ] as SunBurstData["entity"];
  }

  getEntityTopLevel() {
    return this.entityKeys[0] as SunBurstData["entity"];
  }

  getProgressPercentage(userProperties: T["userProperties"]) {
    if (this.getReportData(userProperties).status.complete) return 100;
    const complete = this.getReportData(userProperties).status.steps_complete;
    const total = this.getReportData(userProperties).status.steps_total;
    const percentage = Math.floor((complete / total) * 100);
    if (isNaN(percentage)) return 0;
    return percentage;
  }

  getProgressDetails(userProperties: T["userProperties"], t: tFunctionType) {
    if (!this.getReportData(userProperties).status.operation)
      return { resource: "", type: "" };
    const resource = this.getReportData(userProperties).status.operation
      ?.resource as string;
    const type = this.getReportData(userProperties).status.operation
      ?.type as string;
    return {
      resource,
      type: t(`detailTypes.${type}`),
    };
  }

  getRetryRoute() {
    return this.retryRoute;
  }

  getReportTranslationKey() {
    return this.translationKey;
  }

  getSunBurstData(
    userProperties: T["userProperties"],
    rootTag: string
  ): SunBurstData {
    const sunBurstData = {
      name: rootTag,
      entity: "root" as const,
      value: userProperties.data.report.playcount,
      children: [],
    };
    const translator = new SunBurstDataTranslator(this.entityKeys);
    const result = translator.convert(
      sunBurstData,
      this.getReportData(userProperties).content as AggregateReportContent[],
      this.getEntityTopLevel()
    );
    return result;
  }

  queryIsDataReady(userProperties: T["userProperties"]) {
    if (userProperties.inProgress) return false;
    if (!this.getReportData(userProperties).status.complete) return false;
    if (userProperties.ready) return false;
    if (userProperties.error) return false;
    return true;
  }

  queryIsResumable(userProperties: T["userProperties"]) {
    const canBeResumed =
      userProperties.inProgress === false &&
      userProperties.ready === false &&
      this.getReportData(userProperties).status.complete !== true;

    if (
      userProperties.error === null ||
      userProperties.error === "TimeoutFetch" ||
      userProperties.error.startsWith("DataPoint")
    ) {
      return canBeResumed;
    }
    return false;
  }

  queryUserHasData(userProperties: T["userProperties"]) {
    return !(
      userProperties.ready &&
      userProperties.userName !== null &&
      this.getReportData(userProperties).content.length === 0
    );
  }

  abstract getReportData(
    userProperties: T["userProperties"]
  ): AggregateBaseReportResponseInterface<unknown[]>;

  startDataFetch(user: userHookAsLastFM, userName: string) {
    user[this.hookMethod](userName);
  }
}
