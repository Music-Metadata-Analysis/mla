import { useState } from "react";
import ErrorBoundary from "../react-error-boundary";
import { createSimpleComponent } from "@fixtures/react/simple";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";

export const testIDs = {
  ComponentWithOutError: "ComponentWithOutError",
  ComponentWithError: "ComponentWithError",
  ErrorTrigger: "ErrorTrigger",
  MockErrorHandlerComponent: "MockErrorHandlerComponent",
  TestComponent: "TestComponent",
};

const ComponentWithError = () => {
  throw new Error("Test Error!");
};

const ComponentWithOutError = createSimpleComponent("ComponentWithOutError");

interface ErrorBoundaryTestHarnessProps {
  mockRoute: string;
  mockStateReset: () => void;
}

export const MockErrorHandlerComponent = jest.fn(() => (
  <div data-testid={testIDs.MockErrorHandlerComponent} />
));

export const mockErrorHandlerFactory = jest.fn(
  (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eventDefinition: AnalyticsEventDefinitionInterface
  ) => MockErrorHandlerComponent
);

export const mockAnalyticsEvent = new analyticsVendor.EventDefinition({
  category: "TEST",
  label: "TEST",
  action: "Test Action.",
});

export const ErrorBoundaryTestHarness = ({
  mockRoute,
  mockStateReset,
}: ErrorBoundaryTestHarnessProps) => {
  const [isError, triggerError] = useState(false);

  return (
    <ErrorBoundary
      errorHandlerFactory={mockErrorHandlerFactory}
      eventDefinition={mockAnalyticsEvent}
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
