import FlagSmithClient from "./client/flagsmith";
import FlagSmithGroup from "./group/flagsmith";
import type { FlagVendorInterface } from "@src/backend/api/types/integrations/flags/vendor.types";

const flagVendor: FlagVendorInterface = {
  Client: FlagSmithClient,
  Group: FlagSmithGroup,
};

export default flagVendor;
