// tslint:disable:no-namespace
declare module "use-persisted-reducer" {
  import type { useReducer } from "react";
  function createPersistedReducer(localStorageKey: string): useReducer;
  export default createPersistedReducer;
}
