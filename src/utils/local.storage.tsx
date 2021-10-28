import { useReducer } from "react";
import createPersistedReducer from "use-persisted-reducer";

export const getSSRreducer = (key: string) => {
  if (typeof global.window === "undefined") return useReducer;
  return createPersistedReducer(key);
};
