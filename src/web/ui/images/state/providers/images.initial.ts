import { voidFn } from "@src/utilities/generics/voids";
import type { ImagesControllerContextInterface } from "@src/web/ui/images/types/state/provider.types";

export const InitialState = {
  loadedCount: 0,
};

const InitialContext = <ImagesControllerContextInterface>{
  ...InitialState,
  setLoadedCount: voidFn,
};

export default InitialContext;
