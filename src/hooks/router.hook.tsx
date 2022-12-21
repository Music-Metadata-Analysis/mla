import webFrameworkVendor from "@src/clients/web.framework/vendor";
import type { WebFrameworkVendorRouterHookInterface } from "@src/types/clients/web.framework/vendor.types";

const useRouter = (): WebFrameworkVendorRouterHookInterface => {
  const routerHook = webFrameworkVendor.routerHook();
  return routerHook;
};

export default useRouter;

export type RouterHookType = ReturnType<typeof useRouter>;
