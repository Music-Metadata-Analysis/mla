import type SunBurstBaseNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base";
import type FlipCardReportStateBase from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { d3Node } from "@src/types/reports/sunburst.types";

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

export interface LastFMSunBurstDrawerInterface {
  alignment: "left" | "right";
  isOpen: boolean;
  node: SunBurstBaseNodeEncapsulation;
  onClose: () => void;
  setSelectedNode: (node: d3Node) => void;
  svgTransition: boolean;
}
