import { getSession } from "next-auth/react";
import { isBuildTime } from "../../../utils/next";
import type { AuthVendorSSRInterface } from "../../../types/clients/auth/vendor.types";
import type { GetSessionParams } from "next-auth/react";

class NextAuthSSR implements AuthVendorSSRInterface {
  getSession = async (req: unknown) => {
    if (isBuildTime()) return null;
    return await getSession(req as GetSessionParams);
  };
}

export default NextAuthSSR;
