import ErrorHandlerFactory from "@src/components/errors/boundary/handler/factory/error.handler.factory.class";
import { errorVendor } from "@src/vendors/integrations/errors/vendor";
import type { AnalyticsEventDefinitionInterface } from "@src/web/analytics/collection/events/types/event.types";

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
  return (
    <errorVendor.ErrorBoundary
      eventDefinition={eventDefinition}
      errorHandlerFactory={new ErrorHandlerFactory().create}
      route={route}
      stateReset={stateReset}
    >
      {children}
    </errorVendor.ErrorBoundary>
  );
}
