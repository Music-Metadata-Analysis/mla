import { render } from "@testing-library/react";
import { InitialState } from "../metrics.initial";
import MetricsProvider, { MetricsContext } from "../metrics.provider";
import settings from "@src/config/metrics";
import PersistentReducerFactory from "@src/hooks/utility/local.storage/persisted.reducer.hook.factory.class";
import type { MetricsContextInterface } from "@src/types/metrics/context.types";

jest.mock(
  "@src/hooks/utility/local.storage/persisted.reducer.hook.factory.class"
);

describe("MetricsProvider", () => {
  const received: Partial<MetricsContextInterface> = {};

  const mockReducerProperties = [{ ...InitialState }, jest.fn()];

  const mockReducer = jest.fn(() => mockReducerProperties) as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
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
        .mocked(PersistentReducerFactory.prototype.create)
        .mockReturnValueOnce(mockReducer);
      arrange();
    });

    it("should instantiate the factory as expected", () => {
      expect(PersistentReducerFactory).toBeCalledTimes(1);
      expect(PersistentReducerFactory).toBeCalledWith();
    });

    it("should create a persisted reducer with the expected local storage key", () => {
      expect(PersistentReducerFactory.prototype.create).toBeCalledTimes(1);
      expect(PersistentReducerFactory.prototype.create).toBeCalledWith(
        settings.localStorageKey
      );
    });

    it("should contain the expected properties", () => {
      const properties = received as MetricsContextInterface;
      expect(properties.metrics).toBe(mockReducerProperties[0]);
      expect(properties.dispatch).toBe(mockReducerProperties[1]);
    });
  });
});
