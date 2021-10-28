import type { UserInterfacePopUpsActionType } from "./ui.popups.action.types";
import type { UserInterfacePopUpsStateInterface } from "./ui.popups.state.types";

export type userDispatchType = (action: UserInterfacePopUpsActionType) => void;

export interface UserInterfacePopUpsContextInterface {
  status: UserInterfacePopUpsStateInterface;
  dispatch: userDispatchType;
}
