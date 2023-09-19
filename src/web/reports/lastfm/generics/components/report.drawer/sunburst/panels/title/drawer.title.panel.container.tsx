import SunBurstDrawerTitlePanel from "./drawer.title.panel.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import type SunBurstNodeAbstractBase from "@src/web/reports/lastfm/generics/components/report.component/sunburst/encapsulations/sunburst.node.encapsulation.base.class";

export interface SunBurstDrawerTitlePanelContainerProps {
  node: SunBurstNodeAbstractBase;
}

export default function SunBurstDrawerTitlePanelContainer({
  node,
}: SunBurstDrawerTitlePanelContainerProps) {
  const { t: sunBurstT } = useTranslation("sunburst");

  const title = node.getDrawerTitle();
  const subTitle = node.getDrawerSubTitle(sunBurstT);

  return (
    <SunBurstDrawerTitlePanel
      titleText={title}
      subTitleText={subTitle ? `(${subTitle})` : "\u00A0"}
    />
  );
}
