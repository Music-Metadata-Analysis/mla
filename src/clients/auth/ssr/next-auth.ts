import { getSession } from "next-auth/react";
import type { AuthVendorSSRInterface } from "../../../types/clients/auth/vendor.types";

class NextAuthSSR implements AuthVendorSSRInterface {
  getSession = async () => {
    return getSession();
  };
}

export default NextAuthSSR;
