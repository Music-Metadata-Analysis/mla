import type {
  WebFrameworkVendorReducerActionType,
  WebFrameworkVendorMiddlewareOrReducerType,
  WebFrameworkVendorMiddlewareType,
  WebFrameworkVendorNestedMiddlewareType,
} from "@src/vendors/types/integrations/web.framework/vendor.types";
import type { Reducer } from "react";

const applyMiddleware = <
  STATE,
  ACTION extends WebFrameworkVendorReducerActionType
>(
  originalReducer: Reducer<STATE, ACTION>,
  middlewareStack: WebFrameworkVendorMiddlewareType<STATE, ACTION>[]
): Reducer<STATE, ACTION> => {
  const combinedStack: WebFrameworkVendorMiddlewareOrReducerType<
    STATE,
    ACTION
  >[] = [originalReducer, ...middlewareStack];
  const reducerWithMiddleWare = combinedStack.reduce(
    (last, middlewareToApply) => {
      return (
        middlewareToApply as WebFrameworkVendorNestedMiddlewareType<
          STATE,
          ACTION
        >
      )(last);
    }
  );
  return reducerWithMiddleWare as Reducer<STATE, ACTION>;
};

export default applyMiddleware;
