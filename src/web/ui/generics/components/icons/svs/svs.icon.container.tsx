import SVSIcon from "./svs.icon.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export interface SVSIconContainerProps {
  height?: number;
  width?: number;
}

const SVSIconContainer = ({
  width = 50,
  height = 50,
}: SVSIconContainerProps) => {
  const { t } = useTranslation("main");

  return <SVSIcon altText={t("altText.svs")} width={width} height={height} />;
};

export default SVSIconContainer;
