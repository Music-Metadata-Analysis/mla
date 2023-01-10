import { flagVendor } from "@src/vendors/integrations/flags/vendor";
import type { FlagVendorHookInterface } from "@src/vendors/types/integrations/flags/vendor.types";

const useFlags = (): FlagVendorHookInterface => {
  const flagHook = flagVendor.hook();
  return flagHook;
};

export default useFlags;

export type FlagsHookType = ReturnType<typeof useFlags>;
