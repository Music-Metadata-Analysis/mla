import { render } from "@testing-library/react";
import ErrorHandlerContainer, {
  ErrorHandlerContainerProps,
} from "../error.handler.container";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsCollectionHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import ErrorDisplayContainer from "@src/web/ui/errors/components/display/error.display.container";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/ui/errors/components/display/error.display.container", () =>
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
      expect(mockAnalyticsCollectionHook.event).toBeCalledTimes(1);
      expect(mockAnalyticsCollectionHook.event).toBeCalledWith(
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
