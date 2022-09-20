import { useReducer, useState } from "react";
import createPersistedReducer from "use-persisted-reducer";
import useLocalStorage from "./local.storage.state/local.storage.state";

const isSSR = () => typeof global.window === "undefined";

export const getPersistedUseReducer = (key: string) => {
  if (isSSR()) return useReducer;
  return createPersistedReducer(key);
};

export const getPersistedUseState = () => {
  if (isSSR()) return useState;
  return useLocalStorage;
};
