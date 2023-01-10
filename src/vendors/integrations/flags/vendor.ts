import useFlagSmith from "./hooks/flagsmith";
import FlagSmithProvider from "./providers/flagsmith";
import type { FlagVendorInterface } from "@src/vendors/types/integrations/flags/vendor.types";

export const flagVendor: FlagVendorInterface = {
  hook: useFlagSmith,
  Provider: FlagSmithProvider,
};
