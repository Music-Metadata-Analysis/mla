import SunBurstEntityNodeList from "./node.list.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import SunBurstNodeButton from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.button/node.button.component";
import SunBurstNodeDisplay from "@src/web/reports/lastfm/generics/components/drawer/sunburst/nodes/node.display/node.display.component";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";
import type { RefObject } from "react";

export interface SunBurstEntityNodeListContainerProps {
  node: SunBurstNodeAbstractBase;
  scrollRef: RefObject<HTMLDivElement>;
  selectChildNode: (node: SunBurstNodeAbstractBase) => void;
  svgTransition: boolean;
}

export default function SunBurstEntityNodeListContainer({
  node,
  scrollRef,
  selectChildNode,
  svgTransition,
}: SunBurstEntityNodeListContainerProps) {
  const { t: lastFMt } = useTranslation("lastfm");
  const { t: sunBurstT } = useTranslation("sunburst");

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
