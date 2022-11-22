import AnalyticsExternalLinkWrapper from "@src/components/analytics/analytics.link.external/analytics.link.external.container";
import type { PropsWithChildren } from "react";

interface ClickLinkProps {
  href: string;
}

export default function ClickExternalLink({
  children,
  href,
}: PropsWithChildren<ClickLinkProps>) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <AnalyticsExternalLinkWrapper href={href}>
        {children}
      </AnalyticsExternalLinkWrapper>
    </a>
  );
}
