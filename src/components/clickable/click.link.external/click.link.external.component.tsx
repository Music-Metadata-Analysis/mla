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
    <a href={href} target="_blank" rel="noreferrer">
      <AnalyticsWrapper href={href}>{children}</AnalyticsWrapper>
    </a>
  );
}
