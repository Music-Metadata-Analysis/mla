import NextLink from "next/link";
import AnalyticsWrapper from "../analytics.link/analytics.link.component";
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
    <NextLink href={href} passHref>
      <a target="_blank">
        <AnalyticsWrapper href={href}>
          <BaseButton {...buttonProps}>{children}</BaseButton>
        </AnalyticsWrapper>
      </a>
    </NextLink>
  );
}
