import useAnalytics from "../../../hooks/analytics";
import type { EventDefinitionType } from "../../../types/analytics.types";

interface AnalyticsGenericWrapperProps {
  eventDefinition: EventDefinitionType;
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
