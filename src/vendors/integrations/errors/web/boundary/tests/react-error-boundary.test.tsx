import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  ErrorBoundaryTestHarness,
  mockErrorHandlerFactory,
  mockAnalyticsEvent,
  MockErrorHandlerComponent,
  testIDs,
} from "./react-error-boundary.test.harness";
import { mockUseRouter } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("ErrorBoundary", () => {
  const mockRoute = "/";

  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => null);

  const mockStateReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
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

    it("should render the component without an error", async () => {
      await waitFor(() =>
        expect(
          screen.queryByTestId(testIDs.ComponentWithOutError)
        ).not.toBeNull()
      );
    });

    it("should NOT render the error handler component", () => {
      expect(screen.queryByTestId("ErrorHandlerContainer")).toBeNull();
    });

    it("should NOT log an error to the console", () => {
      expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
    });

    describe("when the create error button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByTestId(testIDs.ErrorTrigger);
        consoleErrorSpy.mockClear();
        fireEvent.click(link);
      });

      it("should NOT render the component without an error", async () => {
        await waitFor(() =>
          expect(screen.queryByTestId(testIDs.ComponentWithOutError)).toBeNull()
        );
      });

      it("should call the ErrorHandler factory as expected", () => {
        expect(mockErrorHandlerFactory).toHaveBeenCalledTimes(1);
        expect(mockErrorHandlerFactory).toHaveBeenCalledWith(
          mockAnalyticsEvent
        );
      });

      it("should render the error handler component", async () => {
        expect(
          await screen.findByTestId("MockErrorHandlerComponent")
        ).toBeTruthy();
      });

      it("should report an error to the console", () => {
        expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
        expect(consoleErrorSpy.mock.calls[0][0].message).toBe(
          "Uncaught [Error: Test Error!]"
        );
        expect(consoleErrorSpy.mock.calls[0][0].message).toEqual(
          consoleErrorSpy.mock.calls[1][0].message
        );
        expect(consoleErrorSpy.mock.calls[2][0]).toContain(
          testIDs.ComponentWithError
        );
      });

      describe("when the resetErrorBoundary prop is called", () => {
        let resetErrorBoundary: () => void;

        beforeEach(() => {
          resetErrorBoundary = (MockErrorHandlerComponent as jest.Mock).mock
            .calls[0][0].resetErrorBoundary;
          resetErrorBoundary();
        });

        it("should call the state reset function", () => {
          expect(mockStateReset).toHaveBeenCalledTimes(1);
          expect(mockStateReset).toHaveBeenCalledWith();
        });

        it("should route to the configured destination", () => {
          expect(mockUseRouter.push).toHaveBeenCalledTimes(1);
          expect(mockUseRouter.push).toHaveBeenCalledWith(mockRoute);
        });
      });
    });
  });
});
