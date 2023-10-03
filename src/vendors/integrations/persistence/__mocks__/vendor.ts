import {
  MockPersistentStateFactory,
  MockPersistantReducerFactory,
} from "./vendor.mock";
import type { PersistenceVendorInterface } from "@src/vendors/types/integrations/persistence/vendor.types";

export const persistenceVendor: PersistenceVendorInterface = {
  localStorageHookFactory: MockPersistentStateFactory,
  localStorageReducerFactory: MockPersistantReducerFactory,
};
