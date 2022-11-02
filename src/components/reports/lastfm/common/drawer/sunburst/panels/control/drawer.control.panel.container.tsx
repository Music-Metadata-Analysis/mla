import SunBurstDrawerControlPanel from "./drawer.control.panel.component";
import useLocale from "@src/hooks/locale";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface SunBurstDrawerControlPanelContainerProps {
  node: SunBurstNodeAbstractBase;
  selectParentNode: () => void;
}

export default function SunBurstDrawerControlContainerPanel({
  node,
  selectParentNode,
}: SunBurstDrawerControlPanelContainerProps) {
  const { t: lastFMt } = useLocale("lastfm");

  return (
    <SunBurstDrawerControlPanel
      node={node}
      percentageText={lastFMt("playCountByArtist.drawer.percentage")}
      selectParentNode={selectParentNode}
      valueText={lastFMt("playCountByArtist.drawer.value")}
    />
  );
}
