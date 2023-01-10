import { useFlags, useFlagsmith } from "flagsmith/react";
import flags from "@src/config/flags";
import { authVendor } from "@src/vendors/integrations/auth/vendor";
import type { FlagVendorHookInterface } from "@src/vendors/types/integrations/flags/vendor.types";

const useFlagSmithVendor = (): FlagVendorHookInterface => {
  const { user } = authVendor.hook();
  const flagSmith = useFlagsmith();
  const flagState = useFlags(Object.keys(flags));

  if (user?.group && flagSmith.identity !== user.group)
    flagSmith.identify(user.group);

  const isEnabled = (flagName: string | null | undefined) => {
    if (!flagName) return false;
    if (!flagState[flagName]) return false;
    return flagState[flagName].enabled;
  };

  return {
    isEnabled,
  };
};

export default useFlagSmithVendor;
