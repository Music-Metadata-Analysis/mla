import { InitialState } from "@src/providers/metrics/metrics.initial";

const mockValues = {
  metrics: { ...InitialState },
  increment: jest.fn(),
};

export default mockValues;
