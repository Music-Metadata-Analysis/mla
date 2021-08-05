import { Flex, Spacer } from "@chakra-ui/react";
import translations from "../../../config/translations";
import ButtonLink from "../../button.link/button.link.component";
import NavBarAvatar from "../navbar.avatar/navbar.avatar.component";

interface NavBarLogoProps {
  href: string;
  image: string;
}

const NavBarLogo = ({ href, image }: NavBarLogoProps) => {
  return (
    <Flex h={16} alignItems={"center"}>
      <ButtonLink href={"/"}>{translations.app.title}</ButtonLink>
      <Spacer w="10px" />
      <NavBarAvatar href={href} image={image} />
    </Flex>
  );
};

export default NavBarLogo;
