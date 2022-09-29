import { StyledSelection } from "./navbar.link.styles";
import useColour from "@src/hooks/colour";
import useRouter from "@src/hooks/router";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { MouseEvent } from "react";

interface NavLinkProps {
  path: string;
  selected: boolean;
  children: React.ReactNode;
  trackButtonClick: ButtonClickHandlerType;
}

const NavLink = ({
  path,
  selected,
  children,
  trackButtonClick,
}: NavLinkProps) => {
  const router = useRouter();
  const { navButtonColour, transparent } = useColour();

  const navigate = (
    e: MouseEvent<HTMLElement>,
    buttonName: string,
    path: string
  ) => {
    trackButtonClick(e, buttonName);
    router.push(path);
  };

  return (
    <StyledSelection
      borderColor={selected ? navButtonColour.selectedBackground : transparent}
      onClick={(e) => {
        e.currentTarget.blur();
        navigate(e, children as string, path);
      }}
      pl={[1, 1, 2]}
      pr={[1, 1, 2]}
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
