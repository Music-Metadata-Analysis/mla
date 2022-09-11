import FlagSmithSSR from "./ssr/flagsmith";
import type { FlagVendorSSR } from "../../types/clients/flags/vendor.types";

const flagVendorSSR: FlagVendorSSR = {
  Client: FlagSmithSSR,
};

export default flagVendorSSR;
