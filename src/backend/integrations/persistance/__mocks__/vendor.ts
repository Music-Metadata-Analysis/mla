import { mockPersistanceClient } from "./vendor.mock";
import type { PersistanceVendorInterface } from "@src/types/integrations/persistance/vendor.types";

const persistanceVendor: PersistanceVendorInterface = {
  PersistanceClient: jest.fn(() => mockPersistanceClient),
};

export default persistanceVendor;
