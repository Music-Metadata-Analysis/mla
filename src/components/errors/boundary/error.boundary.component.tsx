import { useRouter } from "next/router";
import { useEffect } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import useAnalytics from "../../../hooks/analytics";
import ErrorHandler, {
  ErrorHandlerProps,
} from "../handler/error.handler.component";
import type Event from "../../../providers/analytics/event.class";

interface ErrorBoundaryProps {
  children: JSX.Element | JSX.Element[];
  eventDefinition: Event;
  route: string;
  stateReset: () => void;
}

const ErrorBoundary = ({
  children,
  eventDefinition,
  route,
  stateReset,
}: ErrorBoundaryProps) => {
  const analytics = useAnalytics();
  const router = useRouter();

  useEffect(() => {
    analytics.event(eventDefinition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorHandler = () => {
    stateReset();
    router.push(route);
  };

  const fallbackRender = ({ error, resetErrorBoundary }: ErrorHandlerProps) => (
    <ErrorHandler error={error} resetErrorBoundary={resetErrorBoundary} />
  );

  return (
    <ReactErrorBoundary fallbackRender={fallbackRender} onReset={errorHandler}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
