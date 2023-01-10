import { Flex, Spacer } from "@chakra-ui/react";
import NavBarAvatar from "../avatar/navbar.avatar.component";
import NavBarLinkContainer from "../link/navbar.link.container";
import routes from "@src/config/routes";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";

interface NavBarLogoProps {
  closeMobileMenu: () => void;
  currentPath: string;
  navBarT: tFunctionType;
  tracker: ButtonClickHandlerType;
  transaction: boolean;
  user: { name?: string; image?: string };
}

const NavBarLogo = ({
  closeMobileMenu,
  currentPath,
  navBarT,
  tracker,
  transaction,
  user,
}: NavBarLogoProps) => {
  return (
    <Flex h={16} alignItems={"center"}>
      <NavBarLinkContainer
        closeMobileMenu={closeMobileMenu}
        selected={currentPath === routes.home}
        path={routes.home}
        tracker={tracker}
        transaction={transaction}
      >
        {navBarT("title")}
      </NavBarLinkContainer>
      <Spacer pl="10px" />
      <NavBarAvatar user={user} />
    </Flex>
  );
};

export default NavBarLogo;
