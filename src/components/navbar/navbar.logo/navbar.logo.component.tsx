import { Flex, Spacer } from "@chakra-ui/react";
import NavBarAvatar from "../navbar.avatar/navbar.avatar.component";
import NavBarLinkContainer from "../navbar.link/navbar.link.container";
import routes from "@src/config/routes";
import useLocale from "@src/hooks/locale";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";

interface NavBarLogoProps {
  closeMobileMenu: () => void;
  currentPath: string;
  tracker: ButtonClickHandlerType;
  transaction: boolean;
  user: { name?: string; image?: string };
}

const NavBarLogo = ({
  closeMobileMenu,
  currentPath,
  tracker,
  transaction,
  user,
}: NavBarLogoProps) => {
  const { t } = useLocale("navbar");

  return (
    <Flex h={16} alignItems={"center"}>
      <NavBarLinkContainer
        closeMobileMenu={closeMobileMenu}
        selected={currentPath === routes.home}
        path={routes.home}
        tracker={tracker}
        transaction={transaction}
      >
        {t("title")}
      </NavBarLinkContainer>
      <Spacer pl="10px" />
      <NavBarAvatar user={user} />
    </Flex>
  );
};

export default NavBarLogo;
