import ClickLink from "../../clickable/click.external.link/click.external.link.component";
import BaseButton from "../button.base/button.base.component";
import type { ButtonProps } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

interface StyledButtonLinkProps extends ButtonProps {
  href: string;
}

export default function StyledButtonLink({
  children,
  href,
  ...buttonProps
}: PropsWithChildren<StyledButtonLinkProps>) {
  return (
    <ClickLink href={href}>
      <BaseButton {...buttonProps}>{children}</BaseButton>
    </ClickLink>
  );
}
