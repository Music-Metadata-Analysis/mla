import { useMemo } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { ErrorVendorErrorBoundaryProps } from "@src/vendors/types/integrations/errors/vendor.types";

export default function ReactErrorBoundaryContainer({
  children,
  errorHandlerFactory,
  eventDefinition,
  route,
  stateReset,
}: ErrorVendorErrorBoundaryProps) {
  const router = webFrameworkVendor.routerHook();

  const errorHandler = () => {
    stateReset();
    router.push(route);
  };

  const ErrorHandler = useMemo(
    () => errorHandlerFactory(eventDefinition),
    [errorHandlerFactory, eventDefinition]
  );

  return (
    <ReactErrorBoundary fallbackRender={ErrorHandler} onReset={errorHandler}>
      {children}
    </ReactErrorBoundary>
  );
}
