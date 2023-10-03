import { persistenceVendor } from "../vendor";
import PersistantReducerFactory from "../web/hooks/persisted.reducer.hook.factory.class";
import PersistentStateFactory from "../web/hooks/persisted.state.hook.factory.class";

describe("persistenceVendor", () => {
  it("should be configured with the correct properties", () => {
    expect(persistenceVendor.localStorageHookFactory).toBe(
      PersistentStateFactory
    );
    expect(persistenceVendor.localStorageReducerFactory).toBe(
      PersistantReducerFactory
    );
  });
});
