import SunBurstDrawerTitlePanel from "./drawer.title.panel.component";
import useLocale from "@src/hooks/locale";
import type SunBurstNodeAbstractBase from "@src/components/reports/lastfm/common/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface SunBurstDrawerTitlePanelContainerProps {
  node: SunBurstNodeAbstractBase;
}

export default function SunBurstDrawerTitlePanelContainer({
  node,
}: SunBurstDrawerTitlePanelContainerProps) {
  const { t: sunBurstT } = useLocale("sunburst");

  const title = node.getDrawerTitle();
  const subTitle = node.getDrawerSubTitle(sunBurstT);

  return (
    <SunBurstDrawerTitlePanel
      titleText={title}
      subTitleText={subTitle ? `(${subTitle})` : "\u00A0"}
    />
  );
}