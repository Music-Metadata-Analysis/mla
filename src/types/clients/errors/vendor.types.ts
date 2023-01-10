import type EventDefinition from "@src/contracts/events/event.class";

interface ErrorVendorErrorBoundaryProps {
  children: JSX.Element | JSX.Element[];
  eventDefinition: EventDefinition;
  route: string;
  stateReset: () => void;
}

export interface ErrorVendorInterface {
  ErrorBoundary: (props: ErrorVendorErrorBoundaryProps) => JSX.Element;
}
