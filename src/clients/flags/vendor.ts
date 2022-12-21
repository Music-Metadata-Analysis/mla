import useFlagSmith from "./hooks/flagsmith";
import FlagSmithProvider from "./providers/flagsmith";
import type { FlagVendorInterface } from "@src/types/clients/flags/vendor.types";

const flagVendor: FlagVendorInterface = {
  hook: useFlagSmith,
  Provider: FlagSmithProvider,
};

export default flagVendor;
