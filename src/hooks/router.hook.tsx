import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { WebFrameworkVendorRouterHookInterface } from "@src/vendors/types/integrations/web.framework/vendor.types";

const useRouter = (): WebFrameworkVendorRouterHookInterface => {
  const routerHook = webFrameworkVendor.routerHook();
  return routerHook;
};

export default useRouter;

export type RouterHookType = ReturnType<typeof useRouter>;
