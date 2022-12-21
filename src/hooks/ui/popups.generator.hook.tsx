import uiFrameworkVendor from "@src/clients/ui.framework/vendor";
import type { UIVendorCreatePopUpHookInterface } from "@src/types/clients/ui.framework/vendor.types";

const usePopUpsGenerator = (props: UIVendorCreatePopUpHookInterface) => {
  const popUpsGeneratorHook = uiFrameworkVendor.createPopUpHook(props);
  return popUpsGeneratorHook;
};

export default usePopUpsGenerator;

export type PopUpsGeneratorHookType = ReturnType<typeof usePopUpsGenerator>;
