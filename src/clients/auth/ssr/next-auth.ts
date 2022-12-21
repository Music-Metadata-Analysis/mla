import { getSession } from "next-auth/react";
import webFrameworkVendor from "@src/clients/web.framework/vendor";
import type { AuthVendorSSRClientInterface } from "@src/types/clients/auth/vendor.types";
import type { GetSessionParams } from "next-auth/react";

class NextAuthSSR implements AuthVendorSSRClientInterface {
  getSession = async (req: unknown) => {
    if (webFrameworkVendor.isBuildTime()) return null;
    return await getSession(req as GetSessionParams);
  };
}

export default NextAuthSSR;
