import { useState } from "react";
import PersistentHookAbstractFactory from "./bases/persistent.hook.abstract.factory";
import createPersistedState from "./local.storage.state/local.storage.state.hook.factory";

export default class PersistentStateFactory extends PersistentHookAbstractFactory<
  typeof useState
> {
  hookFactory = createPersistedState;
  primitiveHook = useState;
}
