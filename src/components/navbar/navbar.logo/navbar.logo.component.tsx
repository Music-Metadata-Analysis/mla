import { Flex, Spacer } from "@chakra-ui/react";
import NavBarAvatar from "../navbar.avatar/navbar.avatar.component";
import NavBarLink from "../navbar.link/navbar.link.component";
import routes from "@src/config/routes";
import useAnalytics from "@src/hooks/analytics";
import useLocale from "@src/hooks/locale";
import useRouter from "@src/hooks/router";

const NavBarLogo = () => {
  const analytics = useAnalytics();
  const { t } = useLocale("navbar");
  const router = useRouter();

  return (
    <Flex h={16} alignItems={"center"}>
      <NavBarLink
        trackButtonClick={analytics.trackButtonClick}
        selected={router.path === routes.home}
        path={routes.home}
      >
        {t("title")}
      </NavBarLink>
      <Spacer pl="10px" />
      <NavBarAvatar />
    </Flex>
  );
};

export default NavBarLogo;
