import { voidFn } from "@src/utils/voids";
import type { PopUpsControllerContextInterface } from "@src/types/controllers/popups/popups.context.types";
import type { PopUpsControllerStateInterface } from "@src/types/controllers/popups/popups.state.types";

export const InitialState = <PopUpsControllerStateInterface>{
  FeedBack: { status: false },
};

const InitialContext = <PopUpsControllerContextInterface>{
  status: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
