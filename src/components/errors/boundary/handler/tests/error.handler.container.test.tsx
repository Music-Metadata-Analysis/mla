import { render } from "@testing-library/react";
import ErrorHandlerContainer, {
  ErrorHandlerContainerProps,
} from "../error.handler.container";
import ErrorDisplayContainer from "@src/components/errors/display/error.display.container";
import Events from "@src/events/events";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAnalyticsHook from "@src/hooks/__mocks__/analytics.hook.mock";

jest.mock("@src/hooks/analytics.hook");

jest.mock("@src/components/errors/display/error.display.container", () =>
  require("@fixtures/react/child").createComponent("ErrorDisplayContainer")
);

describe("createErrorHandlerContainer", () => {
  let consoleErrorSpy: jest.SpyInstance;
  let currentProps: ErrorHandlerContainerProps;

  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);

  const baseProps: ErrorHandlerContainerProps = {
    eventDefinition: Events.General.Test,
    error: mockError,
    handleClick: jest.fn(),
  };

  beforeAll(
    () =>
      (consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => null))
  );

  afterAll(() => consoleErrorSpy.mockRestore());

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrangeRender = () => {
    render(<ErrorHandlerContainer {...currentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
  };

  const checkConsoleErrorLogging = () => {
    it("should write the error message using console.error (useEffect)", () => {
      expect(consoleErrorSpy).toBeCalledTimes(1);
      expect(consoleErrorSpy).toBeCalledWith(currentProps.error);
    });
  };

  const checkAnalyticsEvent = () => {
    it("should emit the correct analytics event (useEffect)", () => {
      expect(mockAnalyticsHook.event).toBeCalledTimes(1);
      expect(mockAnalyticsHook.event).toBeCalledWith(
        currentProps.eventDefinition
      );
    });
  };

  const checkErrorDisplayRender = () => {
    it("should render the ErrorDisplayContainer component with the expected props", () => {
      expect(ErrorDisplayContainer).toBeCalledTimes(1);
      checkMockCall(
        ErrorDisplayContainer,
        {
          error: currentProps.error,
          errorKey: "generic",
          handleClick: currentProps.handleClick,
        },
        0
      );
    });
  };

  describe("when rendered", () => {
    beforeEach(() => arrangeRender());

    checkConsoleErrorLogging();
    checkAnalyticsEvent();
    checkErrorDisplayRender();
  });
});
