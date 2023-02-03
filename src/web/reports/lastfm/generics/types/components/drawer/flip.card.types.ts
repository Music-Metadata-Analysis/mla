import type FlipCardReportStateBase from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";

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
