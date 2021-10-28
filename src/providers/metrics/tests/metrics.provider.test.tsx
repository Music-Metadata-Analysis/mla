import { render } from "@testing-library/react";
import createPersistedReducer from "use-persisted-reducer";
import { InitialState } from "../metrics.initial";
import MetricsProvider, { MetricsContext } from "../metrics.provider";
import type { MetricsContextInterface } from "../../../types/metrics/context.types";

jest.mock("use-persisted-reducer", () => {
  const module = jest.requireActual("use-persisted-reducer");
  return jest.fn((props) => module(props));
});

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
      expect(createPersistedReducer).toBeCalledTimes(1);
      expect(createPersistedReducer).toBeCalledWith("metrics");
    });

    it("should contain the expected properties", () => {
      const properties = received as MetricsContextInterface;
      expect(properties.dispatch).toBeInstanceOf(Function);
      expect(properties.metrics).toStrictEqual(InitialState);
    });
  });
});
