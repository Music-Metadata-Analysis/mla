import NavBarLinkContainer from "../navbar.link/navbar.link.container";
import useLocale from "@src/hooks/locale";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";

interface NavBarOptionsProps {
  closeMobileMenu: () => void;
  config: { [index: string]: string };
  currentPath: string;
  tracker: ButtonClickHandlerType;
  transaction: boolean;
}

const NavBarOptions = ({
  closeMobileMenu,
  config,
  currentPath,
  tracker,
  transaction,
}: NavBarOptionsProps) => {
  const { t } = useLocale("navbar");

  return (
    <>
      {Object.keys(config).map((key) => (
        <NavBarLinkContainer
          closeMobileMenu={closeMobileMenu}
          key={key}
          path={config[key]}
          selected={currentPath === config[key]}
          tracker={tracker}
          transaction={transaction}
        >
          {t(`menu.${key}`)}
        </NavBarLinkContainer>
      ))}
    </>
  );
};

export default NavBarOptions;
