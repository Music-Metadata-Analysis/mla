import type { Dispatch, SetStateAction } from "react";

export interface ScrollBarsControllerContextInterface {
  setStack: Dispatch<SetStateAction<Array<string>>>;
  stack: Array<string>;
}

export interface ScrollBarsControllerStateInterface {
  stack: Array<string>;
}
