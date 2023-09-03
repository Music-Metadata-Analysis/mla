import { voidFn } from "@src/utilities/generics/voids";
import type { ScrollBarsControllerContextInterface } from "@src/web/ui/scrollbars/generics/types/state/provider.types";
import type { ScrollBarsControllerStateInterface } from "@src/web/ui/scrollbars/generics/types/state/provider.types";

export const InitialState = <ScrollBarsControllerStateInterface>{
  setStack: voidFn,
  stack: [],
};

const InitialContext = <ScrollBarsControllerContextInterface>{
  ...InitialState,
};

export default InitialContext;
