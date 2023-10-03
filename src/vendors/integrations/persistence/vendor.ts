import PersistantReducerFactory from "./web/hooks/persisted.reducer.hook.factory.class";
import PersistentStateFactory from "./web/hooks/persisted.state.hook.factory.class";
import type { PersistenceVendorInterface } from "@src/vendors/types/integrations/persistence/vendor.types";

export const persistenceVendor: PersistenceVendorInterface = {
  localStorageHookFactory: PersistentStateFactory,
  localStorageReducerFactory: PersistantReducerFactory,
};
