import { Flex, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NavBarAvatar from "../navbar.avatar/navbar.avatar.component";
import NavBarLink from "../navbar.link/navbar.link.component";
import routes from "@src/config/routes";
import useAnalytics from "@src/hooks/analytics";
import useLocale from "@src/hooks/locale";

const NavBarLogo = () => {
  const analytics = useAnalytics();
  const { t } = useLocale("navbar");
  const router = useRouter();

  return (
    <Flex h={16} alignItems={"center"}>
      <NavBarLink
        trackButtonClick={analytics.trackButtonClick}
        selected={router.pathname === routes.home}
        href={routes.home}
      >
        {t("title")}
      </NavBarLink>
      <Spacer pl="10px" />
      <NavBarAvatar />
    </Flex>
  );
};

export default NavBarLogo;
