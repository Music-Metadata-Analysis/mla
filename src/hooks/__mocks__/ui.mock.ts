import { InitialState as imagesInitialState } from "@src/providers/ui/ui.images/ui.images.initial";

const mockValues = {
  popups: {
    close: jest.fn(),
    open: jest.fn(),
    status: jest.fn(),
  },
  images: {
    count: imagesInitialState.loadedCount,
    load: jest.fn(),
    reset: jest.fn(),
  },
};

export default mockValues;