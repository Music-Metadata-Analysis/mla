import LastFMIcon from "./lastfm.icon.component";
import useLocale from "@src/hooks/locale";

export interface LastFMIconContainerProps {
  height?: number;
  width?: number;
}

const LastFMIconContainer = ({
  width = 50,
  height = 50,
}: LastFMIconContainerProps) => {
  const { t } = useLocale("main");

  return (
    <LastFMIcon altText={t("altText.lastfm")} width={width} height={height} />
  );
};

export default LastFMIconContainer;
