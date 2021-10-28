import { voidFn } from "../../../utils/voids";
import type { UserInterfaceImagesContextInterface } from "../../../types/ui/images/ui.images.context.types";
import type { UserInterfaceImagesStateInterface } from "../../../types/ui/images/ui.images.state.types";

export const InitialState = <UserInterfaceImagesStateInterface>{
  loadedCount: 0,
};

const InitialContext = <UserInterfaceImagesContextInterface>{
  ...InitialState,
  setLoadedCount: voidFn,
};

export default InitialContext;
