import { useRouter } from "next/router";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorHandler, {
  ErrorHandlerProps,
} from "../handler/error.handler.component";
import useAnalytics from "@src/hooks/analytics";
import type EventDefinition from "@src/events/event.class";

interface ErrorBoundaryProps {
  children: JSX.Element | JSX.Element[];
  eventDefinition: EventDefinition;
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

  const errorHandler = () => {
    stateReset();
    router.push(route);
  };

  const fallbackRender = ({ error, resetErrorBoundary }: ErrorHandlerProps) => {
    analytics.event(eventDefinition);
    return (
      <ErrorHandler error={error} resetErrorBoundary={resetErrorBoundary} />
    );
  };

  return (
    <ReactErrorBoundary fallbackRender={fallbackRender} onReset={errorHandler}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
