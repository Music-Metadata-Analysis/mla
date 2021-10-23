import { useRouter } from "next/router";
import { StyledSelection } from "./navbar.link.styles";
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

  const navigate = (
    e: MouseEvent<HTMLElement>,
    buttonName: string,
    href: string
  ) => {
    trackButtonClick(e, buttonName);
    router.push(href);
  };

  return (
    <StyledSelection
      borderColor={selected ? navButtonColour.selectedBackground : transparent}
      onClick={(e) => {
        e.currentTarget.blur();
        navigate(e, children as string, href);
      }}
      pl={2}
      pr={2}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: navButtonColour.hoverBackground,
      }}
      bg={navButtonColour.background}
    >
      {children}
    </StyledSelection>
  );
};

export default NavLink;
