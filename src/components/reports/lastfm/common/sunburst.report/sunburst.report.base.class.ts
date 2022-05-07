import type translations from "../../../../../../public/locales/en/lastfm.json";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { IntegrationRequestType } from "../../../../../types/analytics.types";
import type { LastFMReportClassInterface } from "../../../../../types/clients/api/lastfm/data.report.types";
import type { AggregateBaseReportResponseInterface } from "../../../../../types/integrations/base.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type { LastFMDrawerInterface } from "../sunburst.report.drawer/sunburst.report.drawer.component";
import type { TFunction } from "next-i18next";
import type { FC } from "react";

export default abstract class SunBurstBaseReport<T extends UserState<unknown>>
  implements
    LastFMReportClassInterface<
      T["userProperties"],
      AggregateBaseReportResponseInterface<unknown[]>
    >
{
  encapsulationClass!: new (userProperties: T["userProperties"]) => T;
  drawerComponent!: FC<LastFMDrawerInterface<T>>;
  analyticsReportType!: IntegrationRequestType;
  retryRoute!: string;
  translationKey!: keyof typeof translations;
  hookMethod!: "playCountByArtist";

  getDrawerComponent() {
    return this.drawerComponent;
  }

  getEncapsulatedUserState(userProperties: T["userProperties"]) {
    return new this.encapsulationClass(userProperties);
  }

  getProgressPercentage(userProperties: T["userProperties"]) {
    if (this.getReportData(userProperties).status.complete) return 100;
    const complete = this.getReportData(userProperties).status.steps_complete;
    const total = this.getReportData(userProperties).status.steps_total;
    const percentage = Math.floor((complete / total) * 100);
    if (isNaN(percentage)) return 0;
    return percentage;
  }

  getProgressDetails(userProperties: T["userProperties"], t: TFunction) {
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
