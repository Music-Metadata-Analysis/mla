import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";
import type { VendorFallBackRenderProps } from "@src/vendors/integrations/errors/_types/vendor.specific.types";

export interface ErrorVendorErrorBoundaryProps {
  children: JSX.Element | JSX.Element[];

  errorHandlerFactory: (
    eventDefinition: AnalyticsEventDefinitionInterface
  ) => React.FC<VendorFallBackRenderProps>;
  eventDefinition: AnalyticsEventDefinitionInterface;
  route: string;
  stateReset: () => void;
}

export type ErrorVendorFallBackRenderProps = VendorFallBackRenderProps;

export interface ErrorVendorInterface {
  ErrorBoundary: (props: ErrorVendorErrorBoundaryProps) => JSX.Element;
}
