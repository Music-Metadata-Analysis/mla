import { Reducer } from "react";
import type {
  MiddlewareOrReducerType,
  MiddlewareType,
  NestedType,
} from "../types/reducer.types";

const withMiddleware = <STATE, ACTION>(
  originalReducer: Reducer<STATE, ACTION>,
  middlewarestack: MiddlewareType[]
): Reducer<STATE, ACTION> => {
  const combinedStack: MiddlewareOrReducerType[] = [
    originalReducer,
    ...middlewarestack,
  ];
  const reducerWithMiddleWare = combinedStack.reduce(
    (last, middlewareToApply) => {
      return (middlewareToApply as NestedType)(last);
    }
  );
  return reducerWithMiddleWare as Reducer<STATE, ACTION>;
};

export default withMiddleware;
