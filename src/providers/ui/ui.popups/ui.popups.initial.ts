import { voidFn } from "@src/utils/voids";
import type { UserInterfacePopUpsContextInterface } from "@src/types/ui/popups/ui.popups.context.types";
import type { UserInterfacePopUpsStateInterface } from "@src/types/ui/popups/ui.popups.state.types";

export const InitialState = <UserInterfacePopUpsStateInterface>{
  FeedBack: { status: false },
};

const InitialContext = <UserInterfacePopUpsContextInterface>{
  status: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
