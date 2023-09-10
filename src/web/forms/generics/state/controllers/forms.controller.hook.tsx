import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";

const useFormsController = () => {
  const formHook = uiFrameworkVendor.core.formHook();
  return formHook;
};

export default useFormsController;

export type FormsControllerHookType = ReturnType<typeof useFormsController>;
