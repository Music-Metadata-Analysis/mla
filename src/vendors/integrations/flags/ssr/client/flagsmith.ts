import flagsmith from "flagsmith/isomorphic";
import {
  normalizeNull,
  normalizeUndefined,
} from "@src/utilities/generics/voids";
import type { FlagVendorSSRClientInterface } from "@src/vendors/types/integrations/flags/vendor.ssr.types";

class FlagSmithClientSSR implements FlagVendorSSRClientInterface {
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

export default FlagSmithClientSSR;
