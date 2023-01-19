import { render } from "@testing-library/react";
import ErrorHandlerFactory from "../error.handler.factory.class";
import ErrorHandlerContainer from "@src/components/errors/boundary/handler/error.handler.container";
import Events from "@src/events/events";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import type { AnalyticsEventDefinitionInterface } from "@src/contracts/analytics/types/event.types";
import type { ErrorVendorFallBackRenderProps } from "@src/vendors/types/integrations/errors/vendor.types";

jest.mock(
  "@src/components/errors/boundary/handler/error.handler.container",
  () =>
    require("@fixtures/react/child").createComponent("ErrorHandlerContainer")
);

describe("ErrorHandlerFactory", () => {
  let instance: ErrorHandlerFactory;

  let factoryCurrentProps: AnalyticsEventDefinitionInterface;
  let handlerCurrentProps: ErrorVendorFallBackRenderProps;
  let GeneratedHandlerComponent: (
    props: ErrorVendorFallBackRenderProps
  ) => JSX.Element;

  const mockErrorMessage = "Test Error";
  const mockError = new Error(mockErrorMessage);

  const factoryBaseProps: AnalyticsEventDefinitionInterface =
    Events.General.Test;
  const componentBaseProps: ErrorVendorFallBackRenderProps = {
    error: mockError,
    resetErrorBoundary: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();

    instance = new ErrorHandlerFactory();
  });

  const arrange = () => {
    render(<GeneratedHandlerComponent {...handlerCurrentProps} />);
  };

  const resetProps = () => {
    factoryCurrentProps = { ...factoryBaseProps };
    handlerCurrentProps = { ...componentBaseProps };
  };

  const checkErrorHandlerContainerRender = () => {
    it("should render the ErrorHandlerContainer component with the expected props", () => {
      expect(ErrorHandlerContainer).toBeCalledTimes(1);
      checkMockCall(
        ErrorHandlerContainer,
        {
          error: handlerCurrentProps.error,
          eventDefinition: factoryCurrentProps,
          handleClick: handlerCurrentProps.resetErrorBoundary,
        },
        0
      );
    });
  };

  describe("create", () => {
    describe("when called with a valid AnalyticsEventDefinition", () => {
      beforeEach(
        () => (GeneratedHandlerComponent = instance.create(factoryCurrentProps))
      );

      it("should generate a ErrorHandler component", () => {
        expect(typeof GeneratedHandlerComponent).toBe("function");
      });

      describe("generated ErrorHandler component", () => {
        describe("when rendered", () => {
          beforeEach(() => arrange());

          checkErrorHandlerContainerRender();
        });
      });
    });
  });
});
