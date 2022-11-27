import SVSIcon from "./svs.icon.component";
import useLocale from "@src/hooks/locale";

export interface SVSIconContainerProps {
  height?: number;
  width?: number;
}

const SVSIconContainer = ({
  width = 50,
  height = 50,
}: SVSIconContainerProps) => {
  const { t } = useLocale("main");

  return <SVSIcon altText={t("altText.svs")} width={width} height={height} />;
};

export default SVSIconContainer;
