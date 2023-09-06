import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";
import type { UIVendorCreatePopUpHookInterface } from "@src/vendors/types/integrations/ui.framework/vendor.types";

const usePopUpsGenerator = (props: UIVendorCreatePopUpHookInterface) => {
  const popUpsGeneratorHook = uiFrameworkVendor.popups.creatorHook(props);
  return popUpsGeneratorHook;
};

export default usePopUpsGenerator;

export type PopUpsGeneratorHookType = ReturnType<typeof usePopUpsGenerator>;
