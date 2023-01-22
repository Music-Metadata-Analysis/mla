import NavBarLinkContainer from "../link/navbar.link.container";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { ButtonClickHandlerType } from "@src/web/analytics/collection/types/components/handler.types";

interface NavBarOptionsProps {
  closeMobileMenu: () => void;
  config: { [index: string]: string };
  currentPath: string;
  navBarT: tFunctionType;
  tracker: ButtonClickHandlerType;
  transaction: boolean;
}

const NavBarOptions = ({
  closeMobileMenu,
  config,
  currentPath,
  navBarT,
  tracker,
  transaction,
}: NavBarOptionsProps) => {
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
          {navBarT(`menu.${key}`)}
        </NavBarLinkContainer>
      ))}
    </>
  );
};

export default NavBarOptions;
