import { useReducer } from "react";
import createPersistedReducer from "use-persisted-reducer";
import PersistentHookAbstractFactory from "./bases/persistent.hook.abstract.factory.class";

export default class PersistentReducerFactory extends PersistentHookAbstractFactory<
  typeof useReducer
> {
  hookFactory = createPersistedReducer;
  primitiveHook = useReducer;
}
