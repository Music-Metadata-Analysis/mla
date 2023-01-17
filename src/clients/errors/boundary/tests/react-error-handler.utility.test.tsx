import { render } from "@testing-library/react";
import createErrorHandler, {
  CreateErrorHandlerProps,
  GenerateErrorHandlerProps,
} from "../react-error-boundary.utility";
import ErrorHandlerContainer from "@src/components/errors/boundary/handler/error.handler.container";
import Events from "@src/events/events";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";

jest.mock(
  "@src/components/errors/boundary/handler/error.handler.container",
  () =>
    require("@fixtures/react/child").createComponent("ErrorHandlerContainer")
);

describe("createErrorHandlerContainer", () => {
  let currentProps: CreateErrorHandlerProps;
  let currentComponentProps: GenerateErrorHandlerProps;
  let GeneratedComponent: (props: GenerateErrorHandlerProps) => JSX.Element;

  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);

  const baseProps: CreateErrorHandlerProps = {
    eventDefinition: Events.General.Test,
  };

  const baseComponentProps: GenerateErrorHandlerProps = {
    error: mockError,
    resetErrorBoundary: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrangeGenerate = () => {
    GeneratedComponent = createErrorHandler({ ...currentProps });
  };

  const arrangeRender = () => {
    render(<GeneratedComponent {...currentComponentProps} />);
  };

  const resetProps = () => {
    currentProps = { ...baseProps };
    currentComponentProps = { ...baseComponentProps };
  };

  const checkErrorHandlerContainerRender = () => {
    it("should render the ErrorHandlerContainer component with the expected props", () => {
      expect(ErrorHandlerContainer).toBeCalledTimes(1);
      checkMockCall(
        ErrorHandlerContainer,
        {
          error: currentComponentProps.error,
          eventDefinition: currentProps.eventDefinition,
          handleClick: currentComponentProps.resetErrorBoundary,
        },
        0
      );
    });
  };

  describe("when an error handler component is generated", () => {
    beforeEach(() => arrangeGenerate());

    describe("when the generated error handler component is rendered", () => {
      beforeEach(() => arrangeRender());

      checkErrorHandlerContainerRender();
    });
  });
});
