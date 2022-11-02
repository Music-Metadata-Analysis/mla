import { InitialState } from "@src/providers/controllers/images/images.initial";

const mockValues = {
  count: InitialState.loadedCount,
  load: jest.fn(),
  reset: jest.fn(),
};

export default mockValues;
