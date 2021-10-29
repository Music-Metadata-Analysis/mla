import { InitialState as imagesInitialState } from "../../providers/ui/ui.images/ui.images.initial";

const mockUserInterfaceHook = {
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

export default mockUserInterfaceHook;
