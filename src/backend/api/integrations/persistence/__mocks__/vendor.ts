import { mockPersistenceClient } from "./vendor.mock";
import type { PersistenceVendorInterface } from "@src/backend/api/types/integrations/persistence/vendor.types";

const persistenceVendor: PersistenceVendorInterface = {
  PersistenceClient: jest.fn(() => mockPersistenceClient),
};

export default persistenceVendor;
