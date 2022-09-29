import { getSession } from "next-auth/react";
import webFrameworkVendor from "@src/clients/web.framework/vendor";
import type { AuthVendorSSRInterface } from "@src/types/clients/auth/vendor.types";
import type { GetSessionParams } from "next-auth/react";

class NextAuthSSR implements AuthVendorSSRInterface {
  getSession = async (req: unknown) => {
    if (webFrameworkVendor.isBuildTime()) return null;
    return await getSession(req as GetSessionParams);
  };
}

export default NextAuthSSR;
