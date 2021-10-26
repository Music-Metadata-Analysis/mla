import type translations from "../../../../../../public/locales/en/lastfm.json";
import type useUserInterface from "../../../../../hooks/ui";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/user.state.base.report.class";
import type { ReportType } from "../../../../../types/analytics.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type { LastFMDrawerInterface } from "../flip.card.report.drawer/flip.card.report.drawer.component";
import type { TFunction } from "next-i18next";
import type { FC } from "react";

export default abstract class FlipCardBaseReport<T extends UserState> {
  drawerArtWorkAltText!: string;
  analyticsReportType!: ReportType;
  drawerComponent!: FC<LastFMDrawerInterface<T>>;
  encapsulationClass!: new (
    userProperties: T["userProperties"],
    t: TFunction
  ) => T;
  retryRoute!: string;
  translationKey!: keyof typeof translations;
  hookMethod!: "top20albums" | "top20artists";

  getDrawerArtWorkAltText() {
    return this.drawerArtWorkAltText;
  }

  getDrawerComponent() {
    return this.drawerComponent as FC<LastFMDrawerInterface<T>>;
  }

  getEncapsulatedUserState(userProperties: T["userProperties"], t: TFunction) {
    return new this.encapsulationClass(userProperties, t);
  }

  getFlipCardData(userProperties: T["userProperties"]) {
    return this.getReportData(userProperties);
  }

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
    if (userProperties.inProgress) return false;
    if (userProperties.ready) return false;
    if (userProperties.error) return false;
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

  abstract getReportData(userProperties: T["userProperties"]): unknown[];

  startDataFetch(user: userHookAsLastFM, userName: string) {
    user[this.hookMethod](userName);
  }
}
