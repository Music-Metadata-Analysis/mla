import { voidFn } from "@src/utils/voids";
import type { UserInterfaceImagesContextInterface } from "@src/types/ui/images/ui.images.context.types";
import type { UserInterfaceImagesStateInterface } from "@src/types/ui/images/ui.images.state.types";

export const InitialState = <UserInterfaceImagesStateInterface>{
  loadedCount: 0,
};

const InitialContext = <UserInterfaceImagesContextInterface>{
  ...InitialState,
  setLoadedCount: voidFn,
};

export default InitialContext;
