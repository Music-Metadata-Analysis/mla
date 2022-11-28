import uiFrameworkVendor from "@src/clients/ui.framework/vendor";
import type { VendorCreatePopUpHookProps } from "@src/types/clients/ui.framework/vendor.types";

const usePopUpsGenerator = (props: VendorCreatePopUpHookProps) => {
  const popUpsGeneratorHook = uiFrameworkVendor.createPopUpHook(props);
  return popUpsGeneratorHook;
};

export default usePopUpsGenerator;

export type PopUpsGeneratorHookType = ReturnType<typeof usePopUpsGenerator>;
