import { useTranslation } from "next-i18next";
import { Icon } from "./svs.icon.styles";
import SVS from "../../../../public/images/svs.png";

interface SVSIconProps {
  height?: number;
  width?: number;
}

const SVSIcon = ({ width = 50, height = 50 }: SVSIconProps) => {
  const { t } = useTranslation("main");
  return (
    <Icon alt={t("altText.svs")} src={SVS} width={width} height={height} />
  );
};

export default SVSIcon;
