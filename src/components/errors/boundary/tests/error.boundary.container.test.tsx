import { render } from "@testing-library/react";
import ErrorBoundaryContainer, {
  ErrorBoundaryContainerProps,
} from "../error.boundary.container";
import { createSimpleComponent } from "@fixtures/react/simple";
import ErrorHandlerFactory from "@src/components/errors/boundary/handler/factory/error.handler.factory.class";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import { MockErrorBoundary } from "@src/vendors/integrations/errors/__mocks__/vendor.mock";
import Events from "@src/web/analytics/collection/events/definitions";

jest.mock(
  "@src/components/errors/boundary/handler/factory/error.handler.factory.class"
);

jest.mock("@src/vendors/integrations/errors/vendor");

describe("ErrorBoundaryContainer", () => {
  let currentProps: Omit<ErrorBoundaryContainerProps, "children">;

  const mockEventDefinition = Events.General.Test;
  const mockRoute = "/mock/route";
  const MockChildComponent = createSimpleComponent("MockChildComponent");
  const MockHandlerComponent = createSimpleComponent("MockHandlerComponent");

  const mockStateReset = jest.fn();

  const baseProps: Omit<ErrorBoundaryContainerProps, "children"> = {
    eventDefinition: mockEventDefinition,
    route: mockRoute,
    stateReset: mockStateReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
    jest
      .mocked(ErrorHandlerFactory.prototype.create)
      .mockReturnValue(MockHandlerComponent);
  });

  const arrange = () => {
    render(
      <ErrorBoundaryContainer {...currentProps}>
        <MockChildComponent />
      </ErrorBoundaryContainer>
    );
  };

  const resetProps = () => (currentProps = { ...baseProps });

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should render the underlying vendor ErrorBoundary component with the expected props", () => {
      expect(MockErrorBoundary).toBeCalledTimes(1);
      checkMockCall(
        MockErrorBoundary,
        {
          eventDefinition: mockEventDefinition,
          errorHandlerFactory:
            jest.mocked(ErrorHandlerFactory).mock.instances[0].create,
          route: mockRoute,
          stateReset: mockStateReset,
        },
        0
      );
    });
  });
});
