import SunBurstEntityNodeList from "./node.list.component";
import SunBurstNodeDisplay from "@src/components/reports/lastfm/common/drawer/sunburst/nodes/node.display/node.display.component";
import SunBurstNodeButton from "@src/components/reports/lastfm/common/drawer/sunburst/nodes/note.button/node.button.component";
import useLocale from "@src/hooks/locale";
import type SunBurstNodeEncapsulation from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base";
import type { RefObject } from "react";

export interface SunBurstEntityNodeListContainerProps {
  node: SunBurstNodeEncapsulation;
  scrollRef: RefObject<HTMLDivElement>;
  selectChildNode: (node: SunBurstNodeEncapsulation) => void;
  svgTransition: boolean;
}

export default function SunBurstEntityNodeListContainer({
  node,
  scrollRef,
  selectChildNode,
  svgTransition,
}: SunBurstEntityNodeListContainerProps) {
  const { t: lastFMt } = useLocale("lastfm");
  const { t: sunBurstT } = useLocale("sunburst");

  const getEntityComponent = () => {
    if (node.hasLeafChildren()) {
      return SunBurstNodeDisplay;
    }
    return SunBurstNodeButton;
  };

  const getTitleText = () => {
    return (
      node.getDrawerListTitle(sunBurstT) ||
      lastFMt("playCountByArtist.drawer.noInformation")
    );
  };

  if (svgTransition) return null;

  return (
    <SunBurstEntityNodeList
      EntityComponent={getEntityComponent()}
      node={node}
      scrollRef={scrollRef}
      selectChildNode={selectChildNode}
      svgTransition={svgTransition}
      titleText={getTitleText()}
    />
  );
}
