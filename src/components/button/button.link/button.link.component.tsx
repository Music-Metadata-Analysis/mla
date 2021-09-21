import NextLink from "next/link";
import StyledButton from "../button.standard/button.standard.component";
import type { ButtonProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

interface StyledButtonLinkProps extends ButtonProps {
  analyticsName: string;
  href: string;
}

export default function StyledButtonLink({
  children,
  analyticsName,
  href,
  ...buttonProps
}: PropsWithChildren<StyledButtonLinkProps>) {
  return (
    <NextLink href={href} passHref>
      <a target="_blank">
        <StyledButton {...buttonProps} analyticsName={analyticsName}>
          {children}
        </StyledButton>
      </a>
    </NextLink>
  );
}
