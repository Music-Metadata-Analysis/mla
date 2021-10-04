import NextLink from "next/link";
import AnalyticsWrapper from "../../analytics/analytics.link/analytics.link.component";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  href: string;
}

export default function ClickLink({
  children,
  href,
}: PropsWithChildren<ClickLinkProps>) {
  return (
    <NextLink href={href} passHref>
      <a target="_blank">
        <AnalyticsWrapper href={href}>{children}</AnalyticsWrapper>
      </a>
    </NextLink>
  );
}
