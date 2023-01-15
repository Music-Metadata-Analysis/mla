import { voidFn } from "@src/utilities/generics/voids";
import type { ScrollBarsControllerContextInterface } from "@src/types/controllers/scrollbars/scrollbars.context.types";
import type { ScrollBarsControllerStateInterface } from "@src/types/controllers/scrollbars/scrollbars.state.types";

export const InitialState = <ScrollBarsControllerStateInterface>{
  setStack: voidFn,
  stack: [],
};

const InitialContext = <ScrollBarsControllerContextInterface>{
  ...InitialState,
};

export default InitialContext;
