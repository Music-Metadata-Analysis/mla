import { render, screen, fireEvent } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { useState } from "react";
import Events from "../../../../events/events";
import mockAnalyticsHook from "../../../../hooks/tests/analytics.mock";
import mockRouter from "../../../../tests/fixtures/mock.router";
import ErrorHandler from "../../handler/error.handler.component";
import ErrorBoundary from "../error.boundary.component";

jest.mock("../../handler/error.handler.component", () => {
  const MockErrorHandler = () => (
    <div data-testid={testIDs.ErrorHandlerComponent}>Error Component</div>
  );
  return {
    __esModule: true,
    default: jest.fn(() => <MockErrorHandler />),
  };
});

jest.mock("../../../../hooks/analytics", () => ({
  __esModule: true,
  default: () => mockAnalyticsHook,
}));

const mockTestRoute = "/";
const mockStateReset = jest.fn();

const ComponentWithError = () => {
  throw new Error("test error");
};

const TestComponent = () => {
  const [error, setError] = useState(false);

  return (
    <RouterContext.Provider value={mockRouter}>
      <ErrorBoundary
        eventDefinition={Events.General.Test}
        route={mockTestRoute}
        stateReset={mockStateReset}
      >
        <div data-testid={testIDs.TestComponent}>
          <button
            data-testid={testIDs.TriggerError}
            onClick={() => setError(true)}
          >
            Trigger Error
          </button>
          {error ? (
            <ComponentWithError />
          ) : (
            <div data-testid={testIDs.ChildComponent}>Child Component</div>
          )}
        </div>
      </ErrorBoundary>
    </RouterContext.Provider>
  );
};

const testIDs = {
  ChildComponent: "ChildComponent",
  ErrorHandlerComponent: "ErrorHandlerComponent",
  TestComponent: "TestComponent",
  TriggerError: "TriggerError",
};

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
    consoleErrorSpy = jest.spyOn(console, "error");
    consoleErrorSpy.mockImplementation(() => null);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const arrange = () => {
    render(<TestComponent />);
  };

  it("should be rendered with a test component", async () => {
    await screen.findByTestId(testIDs.TestComponent);
  });

  it("should NOT yet generate an analytics event", () => {
    expect(mockAnalyticsHook.event).toBeCalledTimes(0);
  });

  describe("when an error is thrown", () => {
    beforeEach(async () => {
      const link = await screen.findByTestId(testIDs.TriggerError);
      fireEvent.click(link);
    });

    it("should report an error to jest", () => {
      expect(consoleErrorSpy).toBeCalledTimes(2);
    });

    it("should NOT render the child component", () => {
      expect(screen.queryByTestId(testIDs.ChildComponent)).toBeNull();
    });

    it("should render the error handler component", async () => {
      expect(screen.findByTestId(testIDs.ErrorHandlerComponent)).toBeTruthy();
    });

    it("should generate an analytics event", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(1);
      expect(mockAnalyticsHook.event).toBeCalledWith(Events.General.Test);
    });

    describe("when the error is reset", () => {
      let resetError: () => void;

      beforeEach(() => {
        resetError = (ErrorHandler as jest.Mock).mock.calls[0][0]
          .resetErrorBoundary;
        resetError();
      });

      it("should call the state reset function", () => {
        expect(mockStateReset).toBeCalledTimes(1);
        expect(mockStateReset).toBeCalledWith();
      });

      it("should route to the configured destination", () => {
        expect(mockRouter.push).toBeCalledTimes(1);
        expect(mockRouter.push).toBeCalledWith(mockTestRoute);
      });
    });
  });

  describe("when an error is NOT thrown", () => {
    it("should render the child component", async () => {
      expect(await screen.findByTestId(testIDs.ChildComponent)).toBeTruthy();
    });

    it("should NOT render the error handler component", () => {
      expect(screen.queryByTestId(testIDs.ErrorHandlerComponent)).toBeNull();
    });

    it("should NOT generate an analytics event", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(0);
    });
  });
});
