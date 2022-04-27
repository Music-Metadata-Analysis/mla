import type translations from "../../../../../../public/locales/en/lastfm.json";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { IntegrationRequestType } from "../../../../../types/analytics.types";
import type { AggregateBaseReportResponseInterface } from "../../../../../types/integrations/base.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type { TFunction } from "next-i18next";

export default abstract class SunBurstBaseReport<T extends UserState<unknown>> {
  encapsulationClass!: new (
    userProperties: T["userProperties"],
    t: TFunction
  ) => T;
  analyticsReportType!: IntegrationRequestType;
  retryRoute!: string;
  translationKey!: keyof typeof translations;
  hookMethod!: "playCountByArtist";

  getEncapsulatedUserState(userProperties: T["userProperties"], t: TFunction) {
    return new this.encapsulationClass(userProperties, t);
  }

  getRetryRoute() {
    return this.retryRoute;
  }

  getReportTranslationKey() {
    return this.translationKey;
  }

  queryIsDataReady(userProperties: T["userProperties"]) {
    if (userProperties.inProgress) return false;
    if (userProperties.ready) return false;
    if (userProperties.error) return false;
    return false;
    return true;
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
