import { InitialState } from "@src/web/ui/images/state/providers/images.initial";

const mockValues = {
  count: InitialState.loadedCount,
  load: jest.fn(),
  reset: jest.fn(),
};

export default mockValues;
