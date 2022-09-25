import Head from "next/head";
import settings from "@src/config/head";
import useLocale from "@src/hooks/locale";

export interface HeaderProps {
  pageKey: string;
}

const Header = ({ pageKey }: HeaderProps) => {
  const { t } = useLocale("main");

  return (
    <>
      <Head>
        <title>{t(`pages.${pageKey}.title`)}</title>
        <meta name="description" content={t(`pages.${pageKey}.description`)} />
        <link rel="icon" href={settings.favicon} />{" "}
        <link rel="apple-touch-icon" href={settings.appleTouchIcon} />
      </Head>
    </>
  );
};

export default Header;
