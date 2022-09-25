import NextLink from "next/link";
import AnalyticsWrapper from "@src/components/analytics/analytics.link.internal/analytics.link.internal.component";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  href: string;
}

export default function ClickInternalLink({
  children,
  href,
}: PropsWithChildren<ClickLinkProps>) {
  return (
    <NextLink href={href}>
      <a>
        <AnalyticsWrapper href={href}>{children}</AnalyticsWrapper>
      </a>
    </NextLink>
  );
}
