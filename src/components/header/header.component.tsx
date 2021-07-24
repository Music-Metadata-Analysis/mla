import Head from "next/head";
import settings from "../../config/head";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={settings.description} />
        <link rel="icon" href={settings.favicon} />
        <link rel="apple-touch-icon" href={settings.appleTouchIcon} />
      </Head>
    </>
  );
};

export default Header;
