import AnalyticsButtonWrapper from "./analytics.button.component";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import type { MouseEventHandler } from "react";

interface AnalyticsWrapperProps {
  buttonName: string;
  children: React.ReactNode;
}

const AnalyticsButtonWrapperContainer = ({
  buttonName,
  children,
}: AnalyticsWrapperProps) => {
  const analytics = useAnalytics();

  const clickHandler: MouseEventHandler<HTMLDivElement> = (e) =>
    analytics.trackButtonClick(e, buttonName);

  return (
    <AnalyticsButtonWrapper clickHandler={clickHandler}>
      {children}
    </AnalyticsButtonWrapper>
  );
};

export default AnalyticsButtonWrapperContainer;
