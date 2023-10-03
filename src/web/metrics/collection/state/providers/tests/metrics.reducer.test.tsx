import { InitialState } from "../metrics.initial";
import { MetricsReducer, coreMetricsReducer } from "../metrics.reducer";
import {
  mockApplyMiddleware,
  mockLoggingMiddleware,
} from "@src/vendors/integrations/web.framework/__mocks__/vendor.mock";
import type { MetricsActionType } from "@src/web/metrics/collection/types/state/action.types";
import type { MetricsStateType } from "@src/web/metrics/collection/types/state/state.types";

jest.mock("@src/vendors/integrations/web.framework/vendor");

jest.mock("../metrics.reducer.states.class", () => jest.fn(() => mockStates));

const mockReturn = "MockReturnedState";
const mockStates = {
  SearchMetric: jest.fn(() => mockReturn),
};

describe("MetricsReducer", () => {
  let received: MetricsStateType | null;

  beforeEach(() => {
    received = null;
    mockStates.SearchMetric.mockClear();
  });

  const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

  const arrange = (
    action: MetricsActionType | { type: "NoAction" },
    initialProps: MetricsStateType
  ) => {
    return MetricsReducer({ ...initialProps }, action as MetricsActionType);
  };

  it("should be wrapped in the correct middlewares", () => {
    expect(mockApplyMiddleware).toBeCalledTimes(1);
    expect(mockApplyMiddleware).toBeCalledWith(coreMetricsReducer, [
      mockLoggingMiddleware,
    ]);
  });

  it("should handle SearchMetric correctly", () => {
    const action = {
      type: "SearchMetric",
    } as MetricsActionType;

    received = arrange(action, { ...getInitialState() });
    expect(mockStates.SearchMetric).toBeCalledTimes(1);
    expect(mockStates.SearchMetric).toBeCalledWith(getInitialState(), action);
    expect(received).toBe(mockReturn);
  });

  it("should log to the middleware as expected", () => {
    const action = {
      type: "SearchMetric",
    } as MetricsActionType;

    received = arrange(action, { ...getInitialState() });
  });
});
