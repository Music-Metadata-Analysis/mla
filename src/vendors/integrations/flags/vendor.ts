import useFlagSmith from "./web/hooks/flagsmith";
import FlagSmithProvider from "./web/providers/flagsmith";
import type { FlagVendorInterface } from "@src/vendors/types/integrations/flags/vendor.types";

export const flagVendor: FlagVendorInterface = {
  hook: useFlagSmith,
  Provider: FlagSmithProvider,
};
