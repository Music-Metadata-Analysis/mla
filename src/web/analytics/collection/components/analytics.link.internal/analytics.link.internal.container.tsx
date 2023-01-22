import AnalyticsInternalLinkWrapper from "./analytics.link.internal.component";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import type { MouseEventHandler } from "react";

interface AnalyticsInternalLinkWrapperContainerProps {
  href: string;
  children: React.ReactNode;
}

const AnalyticsInternalLinkWrapperContainer = ({
  href,
  children,
}: AnalyticsInternalLinkWrapperContainerProps) => {
  const analytics = useAnalytics();

  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) =>
    analytics.trackInternalLinkClick(e, href);

  return (
    <AnalyticsInternalLinkWrapper clickHandler={clickHandler}>
      {children}
    </AnalyticsInternalLinkWrapper>
  );
};

export default AnalyticsInternalLinkWrapperContainer;
