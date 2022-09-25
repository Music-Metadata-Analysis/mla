import FlagSmithClient from "./client/flagsmith";
import FlagSmithGroup from "./group/flagsmith";
import type { FlagVendor } from "@src/types/integrations/flags/vendor.types";

const flagVendor: FlagVendor = {
  Client: FlagSmithClient,
  Group: FlagSmithGroup,
};

export default flagVendor;
