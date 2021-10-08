import type translations from "../../../../../../public/locales/en/lastfm.json";
import type useUserInterface from "../../../../../hooks/ui";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/user.state.base.class";
import type { ReportType } from "../../../../../types/analytics.types";
import type { LastFMFlipCardCommonDrawerInterface } from "../../../../../types/clients/api/reports/lastfm.client.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type { TFunction } from "next-i18next";
import type { FC } from "react";

export default abstract class LastFMBaseReport<T extends UserState> {
  analyticsReportType!: ReportType;
  drawerComponent!: FC<LastFMFlipCardCommonDrawerInterface<T>>;
  encapsulationClass!: new (
    userProperties: T["userProperties"],
    t: TFunction
  ) => T;
  retryRoute!: string;
  translationKey!: keyof typeof translations;

  getDrawerComponent() {
    return this.drawerComponent as FC<LastFMFlipCardCommonDrawerInterface<T>>;
  }

  getEncapsulatedUserState(userProperties: T["userProperties"], t: TFunction) {
    return new this.encapsulationClass(userProperties, t);
  }

  getFlipCardData(userProperties: T["userProperties"]) {
    return this.getReportData(userProperties);
  }

  abstract getReportData(userProperties: T["userProperties"]): unknown[];

  getRetryRoute() {
    return this.retryRoute;
  }

  getReportTranslationKey() {
    return this.translationKey;
  }

  queryIsDataReady(
    userProperties: T["userProperties"],
    ui: ReturnType<typeof useUserInterface>
  ) {
    if (userProperties.userName === null) return false;
    if (userProperties.inProgress) return false;
    if (userProperties.ready) return false;
    if (ui.count < this.getNumberOfImageLoads(userProperties)) return false;
    return true;
  }

  queryUserHasData(userProperties: T["userProperties"]) {
    return !(
      userProperties.ready &&
      userProperties.userName !== null &&
      this.getReportData(userProperties).length === 0
    );
  }

  abstract getNumberOfImageLoads(userProperties: T["userProperties"]): number;

  abstract startDataFetch(user: userHookAsLastFM, userName: string): void;
}
