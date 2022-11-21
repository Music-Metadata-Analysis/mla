import Header from "./header.component";
import useLocale from "@src/hooks/locale";

export interface HeaderContainerProps {
  pageKey: string;
}

const HeaderContainer = ({ pageKey }: HeaderContainerProps) => {
  const { t: mainT } = useLocale("main");

  return (
    <Header
      descriptionText={mainT(`pages.${pageKey}.description`)}
      titleText={mainT(`pages.${pageKey}.title`)}
    />
  );
};

export default HeaderContainer;
