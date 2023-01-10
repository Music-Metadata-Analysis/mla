import AnalyticsGenericWrapper from "./analytics.generic.component";
import useAnalytics from "@src/hooks/analytics.hook";
import type EventDefinition from "@src/contracts/events/event.class";
import type { MouseEventHandler } from "react";

interface AnalyticsGenericWrapperProps {
  eventDefinition: EventDefinition;
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
