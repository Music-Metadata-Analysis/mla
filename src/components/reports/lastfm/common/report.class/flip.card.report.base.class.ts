import LastFMReportQueryAbstractBaseClass from "@src/components/reports/lastfm/common/report.class/bases/report.base.class";
import type translations from "@locales/lastfm.json";
import type { ImagesControllerHookType } from "@src/hooks/controllers/images.controller.hook";
import type FlipCardUserState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { LastFMFlipCardDrawerInterface } from "@src/types/reports/lastfm/components/drawers/flip.card.types";
import type { FlipCardReportStateQueryInterface } from "@src/types/reports/lastfm/states/queries/flipcard.types";
import type { FC } from "react";

export default abstract class FlipCardAbstractBaseReport<
    ReportState extends FlipCardUserState,
    ReportDataType extends unknown[]
  >
  extends LastFMReportQueryAbstractBaseClass<
    ReportState,
    ReportDataType,
    LastFMFlipCardDrawerInterface<ReportState>
  >
  implements
    FlipCardReportStateQueryInterface<
      ReportState,
      ReportDataType,
      LastFMFlipCardDrawerInterface<ReportState>
    >
{
  protected abstract drawerComponent: FC<
    LastFMFlipCardDrawerInterface<ReportState>
  >;
  protected abstract encapsulationClass: new (
    reportProperties: ReportState["userProperties"],
    t: tFunctionType
  ) => ReportState;
  protected abstract drawerArtWorkAltTextTranslationKey: string;

  protected abstract hookMethod: "top20albums" | "top20artists" | "top20tracks";
  protected abstract translationKey: keyof typeof translations;

  getDrawerArtWorkAltTextTranslationKey() {
    return this.drawerArtWorkAltTextTranslationKey;
  }

  queryIsImagesLoaded(
    reportProperties: ReportState["userProperties"],
    imagesController: ImagesControllerHookType
  ) {
    return !(
      imagesController.count < this.getNumberOfImageLoads(reportProperties)
    );
  }

  queryUserHasNoData(reportProperties: ReportState["userProperties"]) {
    return (
      reportProperties.ready &&
      reportProperties.userName !== null &&
      this.getReportData(reportProperties).length === 0
    );
  }
  abstract getNumberOfImageLoads(
    reportProperties: ReportState["userProperties"]
  ): number;

  abstract getReportData(
    reportProperties: ReportState["userProperties"]
  ): ReportDataType;
}
