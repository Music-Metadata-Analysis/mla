import Header from "./header.component";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";

export interface HeaderContainerProps {
  pageKey: string;
}

const HeaderContainer = ({ pageKey }: HeaderContainerProps) => {
  const { t: mainT } = useTranslation("main");

  return (
    <Header
      descriptionText={mainT(`pages.${pageKey}.description`)}
      titleText={mainT(`pages.${pageKey}.title`)}
    />
  );
};

export default HeaderContainer;
