import { voidFn } from "@src/utilities/generics/voids";
import type { PopUpsControllerActionType } from "@src/vendors/types/integrations/ui.framework/popups/popups.action.types";
import type { PopUpsControllerStateInterface } from "@src/vendors/types/integrations/ui.framework/popups/popups.state.types";
import type { Dispatch } from "react";

const initialDispatch: Dispatch<PopUpsControllerActionType> = voidFn;
const initialState: PopUpsControllerStateInterface = {};

export const InitialContext = {
  state: initialState,
  dispatch: initialDispatch,
};
