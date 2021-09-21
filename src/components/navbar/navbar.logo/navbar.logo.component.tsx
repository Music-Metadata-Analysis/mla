import { Flex, Spacer } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import routes from "../../../config/routes";
import SimpleLink from "../../link/link.component";
import NavBarAvatar from "../navbar.avatar/navbar.avatar.component";

interface NavBarLogoProps {
  href: string;
  image: string;
}

const NavBarLogo = ({ href, image }: NavBarLogoProps) => {
  const { t } = useTranslation("navbar");

  return (
    <Flex h={16} alignItems={"center"}>
      <SimpleLink href={routes.home}>{t("title")}</SimpleLink>
      <Spacer w="10px" />
      <NavBarAvatar href={href} image={image} />
    </Flex>
  );
};

export default NavBarLogo;
