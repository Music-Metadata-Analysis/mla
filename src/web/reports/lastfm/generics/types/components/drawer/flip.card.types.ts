import type FlipCardReportStateBase from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";

export interface LastFMFlipCardDrawerInterface<
  ReportStateType extends FlipCardReportStateBase
> {
  artWorkAltTranslatedText: string;
  fallbackImage: string;
  isOpen: boolean;
  objectIndex: number | null;
  onClose: () => void;
  reportStateInstance: ReportStateType;
}
