import { getSession } from "next-auth/react";
import type { AuthVendorSSR } from "../../../types/clients/auth/vendor.types";
import type { GetSessionParams } from "next-auth/react";

class NextAuthSSR implements AuthVendorSSR {
  getSession = async (req: unknown) => {
    if (!global.window) return null;
    return await getSession(req as GetSessionParams);
  };
}

export default NextAuthSSR;
