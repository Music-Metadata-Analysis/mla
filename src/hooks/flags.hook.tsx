import flagVendor from "@src/clients/flags/vendor";
import type { FlagVendorHookInterface } from "@src/types/clients/flags/vendor.types";

const useFlags = (): FlagVendorHookInterface => {
  const flagHook = flagVendor.hook();
  return flagHook;
};

export default useFlags;

export type FlagsHookType = ReturnType<typeof useFlags>;
