import { Flex, Spacer } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import routes from "../../../config/routes";
import useAnalytics from "../../../hooks/analytics";
import NavBarAvatar from "../navbar.avatar/navbar.avatar.component";
import NavBarLink from "../navbar.link/navbar.link.component";

interface NavBarLogoProps {
  href: string;
  image: string;
}

const NavBarLogo = ({ href, image }: NavBarLogoProps) => {
  const analytics = useAnalytics();
  const { t } = useTranslation("navbar");
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
      <NavBarAvatar href={href} image={image} />
    </Flex>
  );
};

export default NavBarLogo;
