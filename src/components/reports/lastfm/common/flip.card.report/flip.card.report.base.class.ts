import type { LastFMDrawerInterface } from "../flip.card.report.drawer/flip.card.report.drawer.component";
import type translations from "@locales/lastfm.json";
import type useUserInterface from "@src/hooks/ui";
import type UserState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { IntegrationRequestType } from "@src/types/analytics.types";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type { FC } from "react";

export default abstract class FlipCardBaseReport<T extends UserState> {
  drawerArtWorkAltText!: string;
  analyticsReportType!: IntegrationRequestType;
  drawerComponent!: FC<LastFMDrawerInterface<T>>;
  encapsulationClass!: new (
    userProperties: T["userProperties"],
    t: tFunctionType
  ) => T;
  retryRoute!: string;
  translationKey!: keyof typeof translations;
  hookMethod!: "top20albums" | "top20artists" | "top20tracks";

  getDrawerArtWorkAltText() {
    return this.drawerArtWorkAltText;
  }

  getDrawerComponent() {
    return this.drawerComponent as FC<LastFMDrawerInterface<T>>;
  }

  getEncapsulatedUserState(
    userProperties: T["userProperties"],
    t: tFunctionType
  ) {
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
    if (ui.images.count < this.getNumberOfImageLoads(userProperties))
      return false;
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
