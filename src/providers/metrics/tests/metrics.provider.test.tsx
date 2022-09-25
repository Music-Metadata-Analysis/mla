import { render } from "@testing-library/react";
import { InitialState } from "../metrics.initial";
import MetricsProvider, { MetricsContext } from "../metrics.provider";
import { getPersistedUseReducer } from "@src/hooks/utility/local.storage";
import type { MetricsContextInterface } from "@src/types/metrics/context.types";

jest.mock("@src/hooks/utility/local.storage", () => ({
  getPersistedUseReducer: jest.fn(() => mockReducer),
}));

const mockReducer = jest.fn(() => mockReducerProperties);
const mockReducerProperties = [{ ...InitialState }, jest.fn()];

describe("MetricsProvider", () => {
  const received: Partial<MetricsContextInterface> = {};

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
      arrange();
    });

    it("should create a persisted reducer with the expected local storage key", () => {
      expect(getPersistedUseReducer).toBeCalledTimes(1);
      expect(getPersistedUseReducer).toBeCalledWith("metrics");
    });

    it("should contain the expected properties", () => {
      const properties = received as MetricsContextInterface;
      expect(properties.metrics).toBe(mockReducerProperties[0]);
      expect(properties.dispatch).toBe(mockReducerProperties[1]);
    });
  });
});
