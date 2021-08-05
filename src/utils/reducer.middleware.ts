import type {
  MiddlewareOrReducerType,
  MiddlewareType,
  NestedType,
} from "../types/reducer.types";
import type { Reducer } from "react";

const withMiddleware = <STATE, ACTION>(
  originalReducer: Reducer<STATE, ACTION>,
  middlewarestack: MiddlewareType<STATE, ACTION>[]
): Reducer<STATE, ACTION> => {
  const combinedStack: MiddlewareOrReducerType<STATE, ACTION>[] = [
    originalReducer,
    ...middlewarestack,
  ];
  const reducerWithMiddleWare = combinedStack.reduce(
    (last, middlewareToApply) => {
      return (middlewareToApply as NestedType<STATE, ACTION>)(last);
    }
  );
  return reducerWithMiddleWare as Reducer<STATE, ACTION>;
};

export default withMiddleware;
