import useFlagSmith from "./hooks/flagsmith";
import FlagSmithProvider from "./providers/flagsmith";
import FlagSmithSSR from "./ssr/flagsmith";
import type { FlagVendor } from "../../types/clients/flags/vendor.types";

const flagVendor: FlagVendor = {
  hook: useFlagSmith,
  Provider: FlagSmithProvider,
  SSR: FlagSmithSSR,
};

export default flagVendor;
