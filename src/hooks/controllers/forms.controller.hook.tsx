import uiFrameworkVendor from "@src/clients/ui.framework/vendor";

const useFormsController = () => {
  const formHook = uiFrameworkVendor.formHook();
  return formHook;
};

export default useFormsController;

export type FormsControllerHookType = ReturnType<typeof useFormsController>;
