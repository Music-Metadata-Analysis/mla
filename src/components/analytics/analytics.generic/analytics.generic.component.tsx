import useAnalytics from "@src/hooks/analytics";
import type EventDefinition from "@src/events/event.class";

interface AnalyticsGenericWrapperProps {
  eventDefinition: EventDefinition;
  children: React.ReactNode;
}

const AnalyticsGenericWrapper = ({
  eventDefinition,
  children,
}: AnalyticsGenericWrapperProps) => {
  const analytics = useAnalytics();

  return <div onClick={() => analytics.event(eventDefinition)}>{children}</div>;
};

export default AnalyticsGenericWrapper;
