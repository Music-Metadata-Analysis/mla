import FlagSmithSSR from "./ssr/flagsmith";
import type { FlagVendorSSRInterface } from "@src/vendors/types/integrations/flags/vendor.ssr.types";

export const flagVendorSSR: FlagVendorSSRInterface = {
  Client: FlagSmithSSR,
};
