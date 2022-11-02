import { InitialState } from "./popups.initial";
import type { PopUpsControllerActionType } from "@src/types/controllers/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/types/controllers/popups/popups.state.types";

class PopUpsControllerReducerStates {
  wrongTypeError = "Received wrong action type.";

  HidePopUp(
    state: PopUpsControllerStateInterface,
    action: PopUpsControllerActionType
  ): PopUpsControllerStateInterface {
    if (action.type === "HidePopUp") {
      const name = action.name;
      return {
        ...this.getInitialState(),
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
        ...this.getInitialState(),
        [name]: { status: true },
      };
    }
    throw new Error(this.wrongTypeError);
  }

  private getInitialState = () => JSON.parse(JSON.stringify(InitialState));
}

export default PopUpsControllerReducerStates;
