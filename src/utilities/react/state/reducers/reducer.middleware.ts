import type {
  MiddlewareOrReducerType,
  MiddlewareType,
  NestedType,
} from "@src/utilities/types/react/reducer.types";
import type { Reducer } from "react";

const withMiddleware = <STATE, ACTION>(
  originalReducer: Reducer<STATE, ACTION>,
  middlewareStack: MiddlewareType<STATE, ACTION>[]
): Reducer<STATE, ACTION> => {
  const combinedStack: MiddlewareOrReducerType<STATE, ACTION>[] = [
    originalReducer,
    ...middlewareStack,
  ];
  const reducerWithMiddleWare = combinedStack.reduce(
    (last, middlewareToApply) => {
      return (middlewareToApply as NestedType<STATE, ACTION>)(last);
    }
  );
  return reducerWithMiddleWare as Reducer<STATE, ACTION>;
};

export default withMiddleware;
