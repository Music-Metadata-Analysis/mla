import type EventDefinition from "@src/events/event.class";

interface ErrorBoundaryProps {
  children: JSX.Element | JSX.Element[];
  eventDefinition: EventDefinition;
  route: string;
  stateReset: () => void;
}

export interface ErrorVendor {
  ErrorBoundary: (props: ErrorBoundaryProps) => JSX.Element;
}
