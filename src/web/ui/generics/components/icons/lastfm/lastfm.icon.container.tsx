import LastFMIcon from "./lastfm.icon.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export interface LastFMIconContainerProps {
  height?: number;
  width?: number;
}

const LastFMIconContainer = ({
  width = 50,
  height = 50,
}: LastFMIconContainerProps) => {
  const { t } = useTranslation("main");

  return (
    <LastFMIcon altText={t("altText.lastfm")} width={width} height={height} />
  );
};

export default LastFMIconContainer;
