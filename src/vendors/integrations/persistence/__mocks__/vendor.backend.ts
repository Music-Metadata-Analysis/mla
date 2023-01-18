import { mockPersistenceClient } from "./vendor.backend.mock";
import type { PersistenceVendorBackendInterface } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export const persistenceVendorBackend: PersistenceVendorBackendInterface = {
  PersistenceClient: jest.fn(() => mockPersistenceClient),
};
