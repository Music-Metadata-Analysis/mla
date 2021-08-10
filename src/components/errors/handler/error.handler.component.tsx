import { useEffect } from "react";
import ErrorDisplay from "../display/error.display.component";

export interface ErrorHandlerProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorHandler = ({ error, resetErrorBoundary }: ErrorHandlerProps) => {
  useEffect(() => {
    console.error(error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorDisplay
      error={error}
      errorKey={"generic"}
      resetError={resetErrorBoundary}
    />
  );
};

export default ErrorHandler;
