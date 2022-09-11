import { useFlags } from "flagsmith/react";
import flags from "../../../config/flags";
import type { FlagVendorHookInterface } from "../../../types/clients/flags/vendor.types";

const useFlagSmith = (): FlagVendorHookInterface => {
  const flagState = useFlags(Object.keys(flags));

  const isEnabled = (flagName: string | null | undefined) => {
    if (!flagName) return false;
    if (!flagState[flagName]) return false;
    return flagState[flagName].enabled;
  };

  return {
    isEnabled,
  };
};

export default useFlagSmith;
