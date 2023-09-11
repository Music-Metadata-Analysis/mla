import { useEffect } from "react";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import ErrorDisplayContainer from "@src/web/ui/errors/components/display/error.display.container";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export interface ErrorHandlerContainerProps {
  eventDefinition: AnalyticsEventDefinitionInterface;
  error: Error;
  handleClick: () => void;
}

export default function ErrorHandlerContainer({
  eventDefinition,
  error,
  handleClick,
}: ErrorHandlerContainerProps) {
  const analytics = useAnalytics();

  useEffect(() => {
    console.error(error);
    analytics.event(eventDefinition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorDisplayContainer
      error={error}
      errorKey={"generic"}
      handleClick={handleClick}
    />
  );
}
