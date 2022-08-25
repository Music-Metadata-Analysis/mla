import flagsmith from "flagsmith/isomorphic";
import type { FlagVendorSSR } from "../../../types/clients/flags/vendor.types";

class FlagSmithSSR implements FlagVendorSSR {
  getState = async () => {
    await flagsmith.init({
      environmentID: process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT,
    });
    return flagsmith.getState();
  };
}

export default FlagSmithSSR;
