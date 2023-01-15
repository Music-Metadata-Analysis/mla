import { useState } from "react";
import PersistentHookAbstractFactory from "./bases/persistent.hook.abstract.factory.class";
import createPersistedState from "./state/state.hook.factory";

export default class PersistentStateFactory extends PersistentHookAbstractFactory<
  typeof useState
> {
  hookFactory = createPersistedState;
  primitiveHook = useState;
}
