import BaseButton from "../button.base/button.base.component";
import ClickLink from "@src/web/navigation/links/components/click.link.external/click.link.external.component";
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
