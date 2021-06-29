import React from "react";
import { ActionType } from "../types/reducer.types";
import { isTest, isProduction } from "./env";

const reducerLoggingMiddleware = <STATE, ACTION extends ActionType>(
  reducer: React.Reducer<STATE, ACTION>
): React.Reducer<STATE, ACTION> => {
  let logging = true;
  let name = reducer.name;
  if (isTest() || isProduction()) logging = false;
  const wrappedReducer = (state: STATE, action: ACTION) => {
    if (logging)
      console.log(`** ${name} BEFORE ${action.type}:\n`, { state, action });
    state = reducer(state, action);
    if (logging)
      console.log(`** ${name} AFTER ${action.type}:\n`, { state, action });
    return state;
  };
  return wrappedReducer;
};

export default reducerLoggingMiddleware;
