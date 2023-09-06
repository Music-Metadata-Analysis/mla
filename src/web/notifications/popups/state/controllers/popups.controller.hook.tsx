import { uiFrameworkVendor } from "@src/vendors/integrations/ui.framework/vendor";

const usePopUpsController = () => {
  const popUpsControllerHook = uiFrameworkVendor.popups.controllerHook();
  return popUpsControllerHook;
};

export default usePopUpsController;

export type PopUpsControllerHookType = ReturnType<typeof usePopUpsController>;
