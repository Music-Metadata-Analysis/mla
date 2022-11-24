import { render, screen, fireEvent } from "@testing-library/react";
import {
  ErrorBoundaryTestHarness,
  testIDs,
} from "./error.boundary.test.harness.component";
import ErrorHandler from "../../handler/error.handler.component";
import Events from "@src/events/events";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.mock";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";

jest.mock("@src/hooks/analytics");

jest.mock("@src/hooks/router");

jest.mock("../../handler/error.handler.component", () =>
  require("@fixtures/react/child").createComponent("ErrorHandler")
);

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  const mockRoute = "/";

  const mockStateReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error");
    consoleErrorSpy.mockImplementation(() => null);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const arrange = () => {
    render(
      <ErrorBoundaryTestHarness
        mockRoute={mockRoute}
        mockStateReset={mockStateReset}
      />
    );
  };

  describe("when rendered inside the test harness", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the test component", async () => {
      expect(await screen.findByTestId(testIDs.TestComponent)).toBeTruthy();
    });

    it("should render the component without an error", () => {
      expect(screen.queryByTestId(testIDs.ComponentWithOutError)).toBeNull();
    });

    it("should NOT render the error handler component", async () => {
      expect(screen.queryByTestId("ErrorHandler")).toBeNull();
    });

    it("should NOT generate an analytics event", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(0);
    });

    describe("when the button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByTestId(testIDs.ErrorTrigger);
        fireEvent.click(link);
      });

      it("should report an error to the console", () => {
        expect(consoleErrorSpy).toBeCalledTimes(2);
        const call1 = consoleErrorSpy.mock.calls[0][0] as string;
        const call2 = consoleErrorSpy.mock.calls[1][0] as string;
        expect(call1).toContain("Test Error!");
        expect(call2).toContain(testIDs.ComponentWithError);
      });

      it("should NOT render the component without an error", () => {
        expect(screen.queryByTestId(testIDs.ComponentWithOutError)).toBeNull();
      });

      it("should render the error handler component", async () => {
        expect(screen.findByTestId("ErrorHandler")).toBeTruthy();
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
          expect(mockRouterHook.push).toBeCalledTimes(1);
          expect(mockRouterHook.push).toBeCalledWith(mockRoute);
        });
      });
    });
  });
});
