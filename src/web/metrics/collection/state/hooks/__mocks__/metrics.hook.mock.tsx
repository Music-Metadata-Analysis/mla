import { InitialState } from "@src/web/metrics/collection/state/providers/metrics.initial";

const mockValues = {
  metrics: { ...InitialState },
  increment: jest.fn(),
};

export default mockValues;
