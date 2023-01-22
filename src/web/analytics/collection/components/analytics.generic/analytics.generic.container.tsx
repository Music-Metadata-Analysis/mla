import AnalyticsGenericWrapper from "./analytics.generic.component";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import type { AnalyticsEventDefinitionInterface } from "@src/web/analytics/collection/events/types/event.types";
import type { MouseEventHandler } from "react";

interface AnalyticsGenericWrapperProps {
  eventDefinition: AnalyticsEventDefinitionInterface;
  children: React.ReactNode;
}

const AnalyticsGenericWrapperContainer = ({
  eventDefinition,
  children,
}: AnalyticsGenericWrapperProps) => {
  const analytics = useAnalytics();

  const clickHandler: MouseEventHandler<HTMLDivElement> = () =>
    analytics.event(eventDefinition);

  return (
    <AnalyticsGenericWrapper clickHandler={clickHandler}>
      {children}
    </AnalyticsGenericWrapper>
  );
};

export default AnalyticsGenericWrapperContainer;
