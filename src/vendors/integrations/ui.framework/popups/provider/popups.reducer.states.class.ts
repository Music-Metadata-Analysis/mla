import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";

class PopUpsControllerReducerStates {
  wrongTypeError = "Received wrong action type.";

  HidePopUp(
    state: PopUpsControllerStateInterface,
    action: PopUpsControllerActionType
  ): PopUpsControllerStateInterface {
    if (action.type === "HidePopUp") {
      const name = action.name;
      return {
        ...state,
        [name]: { status: false },
      };
    }
    throw new Error(this.wrongTypeError);
  }
  RegisterPopUp(
    state: PopUpsControllerStateInterface,
    action: PopUpsControllerActionType
  ): PopUpsControllerStateInterface {
    if (action.type === "RegisterPopUp") {
      const name = action.name;
      if (Object.keys(state).includes(name)) return state;
      return {
        ...state,
        [name]: { status: false },
      };
    }
    throw new Error(this.wrongTypeError);
  }
  ShowPopUp(
    state: PopUpsControllerStateInterface,
    action: PopUpsControllerActionType
  ): PopUpsControllerStateInterface {
    if (action.type === "ShowPopUp") {
      const name = action.name;
      return {
        ...state,
        [name]: { status: true },
      };
    }
    throw new Error(this.wrongTypeError);
  }
}

export default PopUpsControllerReducerStates;
