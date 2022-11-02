import type { PopUpsControllerActionType } from "./popups.action.types";
import type { PopUpsControllerStateInterface } from "./popups.state.types";

export type PopUpsControllerDispatchType = (
  action: PopUpsControllerActionType
) => void;

export interface PopUpsControllerContextInterface {
  status: PopUpsControllerStateInterface;
  dispatch: PopUpsControllerDispatchType;
}
