import { useMemo } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import createErrorHandler from "./react-error-boundary.utility";
import useRouter from "@src/hooks/router.hook";
import type EventDefinition from "@src/contracts/events/event.class";

interface ErrorBoundaryContainerProps {
  children: JSX.Element | JSX.Element[];
  eventDefinition: EventDefinition;
  route: string;
  stateReset: () => void;
}

export default function ReactErrorBoundaryContainer({
  children,
  eventDefinition,
  route,
  stateReset,
}: ErrorBoundaryContainerProps) {
  const router = useRouter();

  const errorHandler = () => {
    stateReset();
    router.push(route);
  };

  const ErrorHandler = useMemo(
    () => createErrorHandler({ eventDefinition }),
    [eventDefinition]
  );

  return (
    <ReactErrorBoundary fallbackRender={ErrorHandler} onReset={errorHandler}>
      {children}
    </ReactErrorBoundary>
  );
}
