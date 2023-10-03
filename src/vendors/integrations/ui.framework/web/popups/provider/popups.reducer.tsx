import PopUpsControllerReducerStates from "./popups.reducer.states.class";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

export const corePopUpsControllerReducer = (
  state: PopUpsControllerStateInterface,
  action: PopUpsControllerActionType
) => {
  const stateMethod = action.type;
  const stateGenerator = new PopUpsControllerReducerStates();
  const newState = stateGenerator[stateMethod](state, action);
  return newState;
};

const middlewares = [webFrameworkVendor.reducers.middlewares.logger];
export const PopUpsControllerReducer =
  webFrameworkVendor.reducers.applyMiddleware<
    PopUpsControllerStateInterface,
    PopUpsControllerActionType
  >(corePopUpsControllerReducer, middlewares);
