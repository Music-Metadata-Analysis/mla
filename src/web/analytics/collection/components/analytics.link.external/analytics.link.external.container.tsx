import AnalyticsExternalLinkWrapper from "./analytics.link.external.component";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import type { MouseEventHandler } from "react";

interface AnalyticsExternalLinkWrapperContainerProps {
  href: string;
  children: React.ReactNode;
}

const AnalyticsExternalLinkWrapperContainer = ({
  href,
  children,
}: AnalyticsExternalLinkWrapperContainerProps) => {
  const analytics = useAnalytics();

  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) =>
    analytics.trackExternalLinkClick(e, href);

  return (
    <AnalyticsExternalLinkWrapper clickHandler={clickHandler}>
      {children}
    </AnalyticsExternalLinkWrapper>
  );
};

export default AnalyticsExternalLinkWrapperContainer;
