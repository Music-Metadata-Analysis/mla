import { getSession } from "next-auth/react";
import type { AuthVendorSSR } from "../../../types/clients/auth/vendor.types";

class NextAuthSSR implements AuthVendorSSR {
  getSession = async () => {
    return getSession();
  };
}

export default NextAuthSSR;
