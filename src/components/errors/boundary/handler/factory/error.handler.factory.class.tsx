import ErrorHandlerContainer from "@src/components/errors/boundary/handler/error.handler.container";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";
import type { ErrorVendorFallBackRenderProps } from "@src/vendors/types/integrations/errors/vendor.types";

export default class ErrorHandlerFactory {
  create(eventDefinition: AnalyticsEventDefinitionInterface) {
    const GeneratedErrorHandler = ({
      error,
      resetErrorBoundary,
    }: ErrorVendorFallBackRenderProps) => (
      <ErrorHandlerContainer
        error={error}
        eventDefinition={eventDefinition}
        handleClick={resetErrorBoundary}
      />
    );

    return GeneratedErrorHandler;
  }
}
