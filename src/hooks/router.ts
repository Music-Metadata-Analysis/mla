import webFrameworkVendor from "@src/clients/web.framework/vendor";
import type { VendorRouterHookInterface } from "@src/types/clients/web.framework/vendor.types";

const useRouter = (): VendorRouterHookInterface => {
  const routerHook = webFrameworkVendor.routerHook();
  return routerHook;
};

export default useRouter;
