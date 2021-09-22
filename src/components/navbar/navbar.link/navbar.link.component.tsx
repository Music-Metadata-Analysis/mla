import { useRouter } from "next/router";
import { Selected, UnSelected } from "./navbar.link.styles";
import useColour from "../../../hooks/colour";
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
  const { navButtonColour, transparent } = useColour();
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
      borderColor={selected ? navButtonColour.selectedBackground : transparent}
      onClick={(e) => {
        e.currentTarget.blur();
        navigate(e, children as string, href);
      }}
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: navButtonColour.hoverBackground,
      }}
      bg={navButtonColour.background}
    >
      {children}
    </Element>
  );
};

export default NavLink;
