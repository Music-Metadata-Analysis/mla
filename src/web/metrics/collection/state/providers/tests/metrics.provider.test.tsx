import { render } from "@testing-library/react";
import { InitialState } from "../metrics.initial";
import MetricsProvider, { MetricsContext } from "../metrics.provider";
import settings from "@src/config/metrics";
import { MockPersistantReducerFactory } from "@src/vendors/integrations/persistence/__mocks__/vendor.mock";
import { mockIsSSR } from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { MetricsContextInterface } from "@src/web/metrics/collection/types/state/provider.types";

jest.mock("@src/vendors/integrations/persistence/vendor");

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("MetricsProvider", () => {
  const received: Partial<MetricsContextInterface> = {};

  const mockReducerProperties = [{ ...InitialState }, jest.fn()];

  const mockIsSSRValue = "mockIsSSR" as unknown as boolean;

  const mockReducer = jest.fn(() => mockReducerProperties) as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsSSR.mockReturnValue(mockIsSSRValue);
  });

  const arrange = () => {
    render(
      <MetricsProvider>
        <MetricsContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </MetricsContext.Consumer>
      </MetricsProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      jest
        .mocked(MockPersistantReducerFactory.prototype.create)
        .mockReturnValueOnce(mockReducer);
      arrange();
    });

    it("should instantiate the factory as expected", () => {
      expect(MockPersistantReducerFactory).toHaveBeenCalledTimes(1);
      expect(MockPersistantReducerFactory).toHaveBeenCalledWith();
    });

    it("should create a persisted reducer with the expected local storage key", () => {
      expect(
        MockPersistantReducerFactory.prototype.create
      ).toHaveBeenCalledTimes(1);
      expect(
        MockPersistantReducerFactory.prototype.create
      ).toHaveBeenCalledWith(settings.localStorageKey, mockIsSSRValue);
    });

    it("should contain the expected properties", () => {
      const properties = received as MetricsContextInterface;
      expect(properties.metrics).toBe(mockReducerProperties[0]);
      expect(properties.dispatch).toBe(mockReducerProperties[1]);
    });
  });
});
