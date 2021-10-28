import { InitialState } from "../../providers/metrics/metrics.initial";

const mockMetricsHook = {
  metrics: { ...InitialState },
  increment: jest.fn(),
};

export default mockMetricsHook;
