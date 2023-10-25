import LastFMReportQueryAbstractBaseClass from "@src/web/reports/lastfm/generics/state/queries/bases/query.base.class";
import type translations from "@locales/lastfm.json";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type LastFMReportFlipCardBaseStateEncapsulation from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";
import type { LastFMFlipCardDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/flip.card.types";
import type { FlipCardReportStateQueryInterface } from "@src/web/reports/lastfm/generics/types/state/queries/flip.card.types";
import type { ImagesControllerHookType } from "@src/web/ui/images/state/controllers/images.controller.hook";
import type { FC } from "react";

export default abstract class FlipCardAbstractBaseQuery<
    ReportStateEncapsulation extends LastFMReportFlipCardBaseStateEncapsulation,
    ReportDataType extends unknown[],
  >
  extends LastFMReportQueryAbstractBaseClass<
    ReportStateEncapsulation,
    ReportDataType,
    LastFMFlipCardDrawerInterface<ReportStateEncapsulation>
  >
  implements
    FlipCardReportStateQueryInterface<
      ReportStateEncapsulation,
      ReportDataType,
      LastFMFlipCardDrawerInterface<ReportStateEncapsulation>
    >
{
  protected abstract drawerComponent: FC<
    LastFMFlipCardDrawerInterface<ReportStateEncapsulation>
  >;
  protected abstract encapsulationClass: new (
    reportProperties: ReportStateEncapsulation["reportProperties"],
    t: tFunctionType
  ) => ReportStateEncapsulation;
  protected abstract drawerArtWorkAltTextTranslationKey: string;

  protected abstract hookMethod: "top20albums" | "top20artists" | "top20tracks";
  protected abstract translationKey: keyof typeof translations;

  getDrawerArtWorkAltTextTranslationKey() {
    return this.drawerArtWorkAltTextTranslationKey;
  }

  queryIsImagesLoaded(
    reportProperties: ReportStateEncapsulation["reportProperties"],
    imagesController: ImagesControllerHookType
  ) {
    return !(
      imagesController.count < this.getNumberOfImageLoads(reportProperties)
    );
  }

  queryUserHasNoData(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ) {
    return (
      reportProperties.ready &&
      reportProperties.userName !== null &&
      this.getReportData(reportProperties).length === 0
    );
  }
  abstract getNumberOfImageLoads(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ): number;

  abstract getReportData(
    reportProperties: ReportStateEncapsulation["reportProperties"]
  ): ReportDataType;
}
