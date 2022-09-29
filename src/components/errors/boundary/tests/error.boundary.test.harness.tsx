import { useState } from "react";
import ErrorBoundary from "../error.boundary.component";
import Events from "@src/events/events";

export const testIDs = {
  ComponentWithOutError: "ComponentWithOutError",
  ComponentWithError: "ComponentWithError",
  TestComponent: "TestComponent",
  ErrorTrigger: "ErrorTrigger",
};

const ComponentWithError = () => {
  throw new Error("Test Error!");
};

const ComponentWithOutError = () =>
  require("@fixtures/react/child").createComponent("ComponentWithoutError")
    .default;

interface ErrorBoundaryTestHarnessProps {
  mockRoute: string;
  mockStateReset: () => void;
}

export const ErrorBoundaryTestHarness = ({
  mockRoute,
  mockStateReset,
}: ErrorBoundaryTestHarnessProps) => {
  const [isError, triggerError] = useState(false);

  return (
    <ErrorBoundary
      eventDefinition={Events.General.Test}
      route={mockRoute}
      stateReset={mockStateReset}
    >
      <div data-testid={testIDs.TestComponent}>
        <button
          data-testid={testIDs.ErrorTrigger}
          onClick={() => triggerError(true)}
        >
          {"Error!"}
        </button>
        {isError ? <ComponentWithError /> : <ComponentWithOutError />}
      </div>
    </ErrorBoundary>
  );
};
