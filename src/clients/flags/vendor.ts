import useFlagSmith from "./hooks/flagsmith";
import FlagSmithProvider from "./providers/flagsmith";
import type { FlagVendor } from "@src/types/clients/flags/vendor.types";

const flagVendor: FlagVendor = {
  hook: useFlagSmith,
  Provider: FlagSmithProvider,
};

export default flagVendor;
