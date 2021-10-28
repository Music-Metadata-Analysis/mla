import { useReducer } from "react";
import createPersistedReducer from "use-persisted-reducer";

export const getSSRreducer = (key: string) => {
  let usePersistedReducer: typeof useReducer = createPersistedReducer(key);
  if (typeof global.window === "undefined") usePersistedReducer = useReducer;
  return usePersistedReducer;
};
