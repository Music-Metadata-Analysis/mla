import { InitialState } from "../metrics.initial";
import { MetricsReducer } from "../metrics.reducer";
import type { MetricsActionType } from "@src/web/metrics/collection/types/state/action.types";
import type { MetricsStateType } from "@src/web/metrics/collection/types/state/state.types";

jest.mock("../metrics.reducer.states.class", () => jest.fn(() => mockStates));

const mockReturn = "MockReturnedState";
const mockStates = {
  SearchMetric: jest.fn(() => mockReturn),
};

describe("MetricsReducer", () => {
  let received: MetricsStateType | null;

  beforeEach(() => {
    received = null;
    jest.clearAllMocks();
  });

  const getInitialState = () => JSON.parse(JSON.stringify(InitialState));

  const arrange = (
    action: MetricsActionType | { type: "NoAction" },
    initialProps: MetricsStateType
  ) => {
    return MetricsReducer({ ...initialProps }, action as MetricsActionType);
  };

  it("should handle SearchMetric correctly", () => {
    const action = {
      type: "SearchMetric",
    } as MetricsActionType;

    received = arrange(action, { ...getInitialState() });
    expect(mockStates.SearchMetric).toBeCalledTimes(1);
    expect(mockStates.SearchMetric).toBeCalledWith(getInitialState(), action);
    expect(received).toBe(mockReturn);
  });
});
