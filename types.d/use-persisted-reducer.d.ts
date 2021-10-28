// tslint:disable:no-namespace
declare module "use-persisted-reducer" {
  import type { useReducer } from "react";
  function createPersistedReducer(localStorageKey: string): typeof useReducer;
  export default createPersistedReducer;
}
