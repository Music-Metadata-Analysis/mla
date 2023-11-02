import SVSIcon from "./svs.icon.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

const SVSIconContainer = () => {
  const { t } = useTranslation("main");

  return <SVSIcon altText={t("altText.svs")} />;
};

export default SVSIconContainer;
