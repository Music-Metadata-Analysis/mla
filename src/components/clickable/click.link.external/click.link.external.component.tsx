import NextLink from "next/link";
import AnalyticsWrapper from "@src/components/analytics/analytics.link.external/analytics.link.external.component";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  href: string;
}

export default function ClickExternalLink({
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
