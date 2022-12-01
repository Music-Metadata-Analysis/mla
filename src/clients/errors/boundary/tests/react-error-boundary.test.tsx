import { render, screen, fireEvent } from "@testing-library/react";
import {
  ErrorBoundaryTestHarness,
  testIDs,
} from "./react-error-boundary.test.harness";
import ErrorHandlerContainer from "@src/components/errors/boundary/handler/error.handler.container";
import mockRouterHook from "@src/hooks/__mocks__/router.mock";

jest.mock("@src/hooks/locale");

jest.mock("@src/hooks/router");

jest.mock(
  "@src/components/errors/boundary/handler/error.handler.container",
  () =>
    require("@fixtures/react/child").createComponent("ErrorHandlerContainer")
);

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

    it("should render the component without an error", () => {
      expect(screen.queryByTestId(testIDs.ComponentWithOutError)).toBeNull();
    });

    it("should NOT render the error handler component", () => {
      expect(screen.queryByTestId("ErrorHandlerContainer")).toBeNull();
    });

    it("should NOT log an error to the console", () => {
      expect(consoleErrorSpy).toBeCalledTimes(0);
    });

    describe("when the button is clicked", () => {
      beforeEach(async () => {
        const link = await screen.findByTestId(testIDs.ErrorTrigger);
        fireEvent.click(link);
      });

      it("should NOT render the component without an error", () => {
        expect(screen.queryByTestId(testIDs.ComponentWithOutError)).toBeNull();
      });

      it("should render the error handler component", async () => {
        expect(await screen.findByTestId("ErrorHandlerContainer")).toBeTruthy();
      });

      it("should report an error to the console", () => {
        expect(consoleErrorSpy).toBeCalledTimes(2);
        expect(consoleErrorSpy.mock.calls[0][0]).toContain("Test Error!");
        expect(consoleErrorSpy.mock.calls[1][0]).toContain(
          testIDs.ComponentWithError
        );
      });

      describe("when the error is reset", () => {
        let clickHandler: () => void;

        beforeEach(() => {
          clickHandler = (ErrorHandlerContainer as jest.Mock).mock.calls[0][0]
            .handleClick;
          clickHandler();
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
