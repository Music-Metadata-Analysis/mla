import type FlipCardReportStateBase from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";

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
