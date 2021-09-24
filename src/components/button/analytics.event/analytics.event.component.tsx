import useAnalytics from "../../../hooks/analytics";
import type { EventDefinitionType } from "../../../types/analytics.types";

interface AnalyticsWrapperProps {
  eventDefinition: EventDefinitionType;
  children: React.ReactNode;
}

const AnalyticsEventWrapper = ({
  eventDefinition,
  children,
}: AnalyticsWrapperProps) => {
  const analytics = useAnalytics();

  return <div onClick={() => analytics.event(eventDefinition)}>{children}</div>;
};

export default AnalyticsEventWrapper;
