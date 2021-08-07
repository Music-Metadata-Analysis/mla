import { useTranslation } from "next-i18next";
import Head from "next/head";
import settings from "../../config/head";

export interface HeaderProps {
  pageKey: string;
}

const Header = ({ pageKey }: HeaderProps) => {
  const { t } = useTranslation("main");

  return (
    <>
      <Head>
        <title>{t(`pages.${pageKey}.title`)}</title>
        <meta name="description" content={t(`pages.${pageKey}.description`)} />
        <link rel="icon" href={settings.favicon} />
        <link rel="apple-touch-icon" href={settings.appleTouchIcon} />
      </Head>
    </>
  );
};

export default Header;
