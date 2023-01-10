import type { RouterHookType } from "@src/hooks/router.hook";
import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { FC } from "react";

export type DialogueInlayComponentType = FC<DialogueInlayComponentInterface>;

export interface DialogueInlayComponentInterface {
  t: tFunctionType;
  router: RouterHookType;
}
