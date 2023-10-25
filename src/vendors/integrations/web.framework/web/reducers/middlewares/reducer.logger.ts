import { isTest, isProduction } from "@src/utilities/generics/env";
import type { WebFrameworkVendorReducerActionType } from "@src/vendors/types/integrations/web.framework/vendor.types";
import type { Reducer } from "react";

const reducerLoggingMiddleware = <
  STATE,
  ACTION extends WebFrameworkVendorReducerActionType,
>(
  reducer: Reducer<STATE, ACTION>
): Reducer<STATE, ACTION> => {
  const name = reducer.name;
  const logging: boolean = !isTest() && !isProduction();
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
