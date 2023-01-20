import { StyledButton } from "./navbar.link.style";
import useColour from "@src/hooks/ui/colour.hook";
import type { MouseEvent } from "react";

interface NavLinkProps {
  children: React.ReactNode;
  handleClick: (e: MouseEvent<HTMLElement>) => void;
  transaction: boolean;
  selected: boolean;
}

const NavLink = ({
  children,
  handleClick,
  selected,
  transaction,
}: NavLinkProps) => {
  const { navButtonColour, transparent } = useColour();

  return (
    <StyledButton
      _hover={{
        textDecoration: "none",
        bg: navButtonColour.hoverBackground,
      }}
      bg={navButtonColour.background}
      borderColor={selected ? navButtonColour.selectedBackground : transparent}
      disabled={transaction}
      m={[1, 2, 2]}
      onClick={handleClick}
      pl={[1, 2, 2]}
      pr={[1, 2, 2]}
      rounded={"md"}
    >
      {children}
    </StyledButton>
  );
};

export default NavLink;
