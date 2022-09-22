import { useFlags, useFlagsmith } from "flagsmith/react";
import flags from "../../../config/flags";
import useAuth from "../../../hooks/auth";
import type { FlagVendorHookInterface } from "../../../types/clients/flags/vendor.types";

const useFlagSmithVendor = (): FlagVendorHookInterface => {
  const { user } = useAuth();
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
