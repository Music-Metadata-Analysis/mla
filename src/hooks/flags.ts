import flagVendor from "../clients/flags/vendor";
import type { FlagVendorHookInterface } from "../types/clients/flags/vendor.types";

const useFlags = (): FlagVendorHookInterface => {
  const flagHook = flagVendor.hook();
  return flagHook;
};

export default useFlags;
