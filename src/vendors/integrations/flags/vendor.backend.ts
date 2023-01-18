import FlagSmithClient from "./backend/client/flagsmith";
import FlagSmithGroup from "./backend/group/flagsmith";
import type { FlagVendorBackendInterface } from "@src/vendors/types/integrations/flags/vendor.backend.types";

export const flagVendorBackend: FlagVendorBackendInterface = {
  Client: FlagSmithClient,
  Group: FlagSmithGroup,
};
