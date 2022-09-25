import { Icon } from "./lastfm.icon.styles";
import LastFM from "@public/images/lastfm.png";
import useLocale from "@src/hooks/locale";

interface LastFMIconProps {
  height?: number;
  width?: number;
}

const LastFMIcon = ({ width = 50, height = 50 }: LastFMIconProps) => {
  const { t } = useLocale("main");
  return (
    <Icon
      alt={t("altText.lastfm")}
      src={LastFM}
      width={width}
      height={height}
    />
  );
};

export default LastFMIcon;
