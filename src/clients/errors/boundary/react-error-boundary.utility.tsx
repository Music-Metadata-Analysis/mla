import ErrorHandlerContainer from "@src/components/errors/boundary/handler/error.handler.container";
import type EventDefinition from "@src/contracts/events/event.class";

export interface CreateErrorHandlerProps {
  eventDefinition: EventDefinition;
}

export interface GenerateErrorHandlerProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function createErrorHandler({
  eventDefinition,
}: CreateErrorHandlerProps) {
  const GeneratedErrorHandler = ({
    error,
    resetErrorBoundary,
  }: GenerateErrorHandlerProps) => (
    <ErrorHandlerContainer
      error={error}
      eventDefinition={eventDefinition}
      handleClick={resetErrorBoundary}
    />
  );

  return GeneratedErrorHandler;
}
