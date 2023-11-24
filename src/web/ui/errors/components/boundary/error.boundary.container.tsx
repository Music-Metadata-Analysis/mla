import { errorVendor } from "@src/vendors/integrations/errors/vendor";
import ErrorHandlerFactory from "@src/web/ui/errors/components/boundary/handler/factory/error.handler.factory.class";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export interface ErrorBoundaryContainerProps {
  children: JSX.Element | JSX.Element[];
  eventDefinition: AnalyticsEventDefinitionInterface;
  route: string;
  stateReset: () => void;
}

export default function ErrorBoundaryContainer({
  children,
  eventDefinition,
  route,
  stateReset,
}: ErrorBoundaryContainerProps) {
  const { ErrorBoundary } = errorVendor;

  return (
    <ErrorBoundary
      eventDefinition={eventDefinition}
      errorHandlerFactory={new ErrorHandlerFactory().create}
      route={route}
      stateReset={stateReset}
    >
      {children}
    </ErrorBoundary>
  );
}
