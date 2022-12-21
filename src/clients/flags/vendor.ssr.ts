import FlagSmithSSR from "./ssr/flagsmith";
import type { FlagVendorSSRInterface } from "@src/types/clients/flags/vendor.types";

const flagVendorSSR: FlagVendorSSRInterface = {
  Client: FlagSmithSSR,
};

export default flagVendorSSR;
