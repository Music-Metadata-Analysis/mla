import flagsmith from "flagsmith/isomorphic";
import { normalizeNull, normalizeUndefined } from "@src/utils/voids";
import type { FlagVendorSSRInterface } from "@src/types/clients/flags/vendor.types";

class FlagSmithSSR implements FlagVendorSSRInterface {
  getState = async (identity?: string | null) => {
    await flagsmith.init({
      environmentID: process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT,
      identity: normalizeUndefined(identity),
    });
    return {
      serverState: flagsmith.getState(),
      identity: normalizeNull(identity),
    };
  };
}

export default FlagSmithSSR;
