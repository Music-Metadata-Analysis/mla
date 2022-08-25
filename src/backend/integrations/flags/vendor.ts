import FlagSmithClient from "./client/flagsmith.client.class";
import type { FlagVendor } from "../../../types/integrations/flags/vendor.types";

const flagVendor: FlagVendor = {
  Client: FlagSmithClient,
};

export default flagVendor;
