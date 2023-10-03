import type {
  VendorActionType,
  VendorMiddlewareOrReducerType,
  VendorMiddlewareType,
  VendorNestedType,
} from "@src/vendors/types/integrations/web.framework/vendor.types";
import type { Reducer } from "react";

const applyMiddleware = <STATE, ACTION extends VendorActionType>(
  originalReducer: Reducer<STATE, ACTION>,
  middlewareStack: VendorMiddlewareType<STATE, ACTION>[]
): Reducer<STATE, ACTION> => {
  const combinedStack: VendorMiddlewareOrReducerType<STATE, ACTION>[] = [
    originalReducer,
    ...middlewareStack,
  ];
  const reducerWithMiddleWare = combinedStack.reduce(
    (last, middlewareToApply) => {
      return (middlewareToApply as VendorNestedType<STATE, ACTION>)(last);
    }
  );
  return reducerWithMiddleWare as Reducer<STATE, ACTION>;
};

export default applyMiddleware;
