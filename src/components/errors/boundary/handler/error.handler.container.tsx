import { useEffect } from "react";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import useAnalytics from "@src/hooks/analytics.hook";
import type EventDefinition from "@src/contracts/events/event.class";

export interface ErrorHandlerContainerProps {
  eventDefinition: EventDefinition;
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
