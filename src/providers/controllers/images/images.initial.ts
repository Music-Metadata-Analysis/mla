import { voidFn } from "@src/utilities/generics/voids";
import type { ImagesControllerContextInterface } from "@src/types/controllers/images/images.context.types";
import type { ImagesControllerStateInterface } from "@src/types/controllers/images/images.state.types";

export const InitialState = <ImagesControllerStateInterface>{
  loadedCount: 0,
};

const InitialContext = <ImagesControllerContextInterface>{
  ...InitialState,
  setLoadedCount: voidFn,
};

export default InitialContext;
