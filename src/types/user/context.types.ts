import type { UserActionType } from "./action.types";
import type { UserStateInterface } from "./state.types";

export type userDispatchType = (action: UserActionType) => void;

export interface UserContextInterface {
  userProperties: UserStateInterface;
  dispatch: userDispatchType;
}
