import { useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Selected, UnSelected } from "./navbar.link.styles";
import type { ButtonClickHandlerType } from "../../../types/analytics.types";
import type { MouseEvent } from "react";

interface NavLinkProps {
  href: string;
  selected: boolean;
  children: React.ReactNode;
  trackButtonClick: ButtonClickHandlerType;
}

const NavLink = ({
  href,
  selected,
  children,
  trackButtonClick,
}: NavLinkProps) => {
  const router = useRouter();
  const hoverBackground = useColorModeValue("gray.300", "gray.700");
  const background = useColorModeValue("gray.100", "gray.900");
  const Element = selected ? Selected : UnSelected;

  const navigate = (
    e: MouseEvent<HTMLElement>,
    buttonName: string,
    href: string
  ) => {
    trackButtonClick(e, buttonName);
    router.push(href);
  };

  return (
    <Element
      onClick={(e) => navigate(e, children as string, href)}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: hoverBackground,
      }}
      bg={background}
    >
      {children}
    </Element>
  );
};

export default NavLink;
