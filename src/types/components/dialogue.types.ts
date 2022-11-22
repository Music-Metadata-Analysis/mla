import type { RouterHookType } from "@src/hooks/router";
import type { tFunctionType } from "@src/types/clients/locale/vendor.types";
import type { FC } from "react";

export type DialogueInlayComponentType = FC<DialogueInlayComponentInterface>;

export interface DialogueInlayComponentInterface {
  t: tFunctionType;
  router: RouterHookType;
}
