import type { tFunctionType } from "@src/vendors/types/integrations/locale/vendor.types";
import type { RouterHookType } from "@src/web/navigation/routing/hooks/router.hook";
import type { FC } from "react";

export type DialogueInlayComponentType = FC<DialogueInlayComponentInterface>;

export interface DialogueInlayComponentInterface {
  t: tFunctionType;
  router: RouterHookType;
}
