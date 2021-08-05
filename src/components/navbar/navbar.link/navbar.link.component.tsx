import { Box, Link, useColorModeValue } from "@chakra-ui/react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import type { ButtonClickHandlerType } from "../../../types/analytics.types";

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
  const background = useColorModeValue("gray.200", "gray.700");
  const SelectedBox = styled(Box)`
    border-radius: 10px;
    border-width: 3px;
  `;

  const Element = selected ? SelectedBox : Box;

  return (
    <Element>
      <NextLink href={href} passHref>
        <Link
          onClick={(e) => trackButtonClick(e, children)}
          px={2}
          py={1}
          rounded={"md"}
          _hover={{
            textDecoration: "none",
            bg: background,
          }}
        >
          {children}
        </Link>
      </NextLink>
    </Element>
  );
};

export default NavLink;
