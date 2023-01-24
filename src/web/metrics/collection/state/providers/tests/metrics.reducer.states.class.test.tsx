import { InitialState } from "../metrics.initial";
import MetricsReducerStates from "../metrics.reducer.states.class";
import type { MetricsActionType } from "@src/web/metrics/collection/types/state/action.types";
import type { MetricsStateType } from "@src/web/metrics/collection/types/state/state.types";

describe("MetricsReducerStates", () => {
  let reducerStates: MetricsReducerStates;
  let received: MetricsStateType;

  beforeEach(() => {
    reducerStates = new MetricsReducerStates();
  });

  const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

  const arrange = (action: MetricsActionType, state: MetricsStateType) => {
    return reducerStates[action.type](state, action);
  };

  const arrangeError = (testType: MetricsActionType["type"]) => {
    return () =>
      reducerStates[testType]({ ...getInitialState() }, {
        type: "InvalidAction",
      } as never as MetricsActionType);
  };

  describe("SearchMetric", () => {
    const testType = "SearchMetric" as const;

    describe("with an empty initial state", () => {
      it("should return the the expected state", () => {
        received = arrange(
          {
            type: "SearchMetric",
          },
          {} as MetricsStateType
        );

        expect(received).toStrictEqual({ SearchMetric: 1 });
      });

      it("should not accept incompatible types", () => {
        expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
      });
    });

    describe("with an existing initial state", () => {
      it("should return the the expected state", () => {
        received = arrange(
          {
            type: "SearchMetric",
          },
          {
            SearchMetric: 10,
          }
        );

        expect(received).toStrictEqual({
          SearchMetric: 11,
        });
      });

      it("should not accept incompatible types", () => {
        expect(arrangeError(testType)).toThrow(reducerStates.wrongTypeError);
      });
    });
  });
});
