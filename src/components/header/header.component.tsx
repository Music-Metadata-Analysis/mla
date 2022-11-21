import webFrameworkVendor from "@src/clients/web.framework/vendor";
import settings from "@src/config/head";

export interface HeaderProps {
  titleText: string;
  descriptionText: string;
}

const Header = ({ descriptionText, titleText }: HeaderProps) => {
  return (
    <>
      <webFrameworkVendor.HeadShim>
        <title>{titleText}</title>
        <meta name="description" content={descriptionText} />
        <link rel="icon" href={settings.favicon} />
        <link rel="apple-touch-icon" href={settings.appleTouchIcon} />
      </webFrameworkVendor.HeadShim>
    </>
  );
};

export default Header;
