import LastFMIcon from "./lastfm.icon.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

const LastFMIconContainer = () => {
  const { t } = useTranslation("main");

  return <LastFMIcon altText={t("altText.lastfm")} />;
};

export default LastFMIconContainer;
