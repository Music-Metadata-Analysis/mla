import SunBurstDrawerControlPanel from "./drawer.control.panel.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface SunBurstDrawerControlPanelContainerProps {
  node: SunBurstNodeAbstractBase;
  selectParentNode: () => void;
}

export default function SunBurstDrawerControlContainerPanel({
  node,
  selectParentNode,
}: SunBurstDrawerControlPanelContainerProps) {
  const { t: lastFMt } = useTranslation("lastfm");

  return (
    <SunBurstDrawerControlPanel
      node={node}
      percentageText={lastFMt("playCountByArtist.drawer.percentage")}
      selectParentNode={selectParentNode}
      valueText={lastFMt("playCountByArtist.drawer.value")}
    />
  );
}
