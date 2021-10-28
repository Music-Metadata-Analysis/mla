import { voidFn } from "../../../utils/voids";
import type { UserInterfacePopUpsContextInterface } from "../../../types/ui/popups/ui.popups.context.types";
import type { UserInterfacePopUpsStateInterface } from "../../../types/ui/popups/ui.popups.state.types";

export const InitialState = <UserInterfacePopUpsStateInterface>{
  FeedBack: { status: false },
};

const InitialContext = <UserInterfacePopUpsContextInterface>{
  status: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
