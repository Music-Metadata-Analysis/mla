import { mockPersistanceClient } from "./vendor.mock";
import type { PersistanceVendor } from "@src/types/integrations/persistance/vendor.types";

const persistanceVendor: PersistanceVendor = {
  PersistanceClient: jest.fn(() => mockPersistanceClient),
};

export default persistanceVendor;
