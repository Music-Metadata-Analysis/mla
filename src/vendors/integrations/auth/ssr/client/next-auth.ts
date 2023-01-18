import { getSession } from "next-auth/react";
import { webFrameworkVendor } from "@src/vendors/integrations/web.framework/vendor";
import type { AuthVendorSSRClientInterface } from "@src/vendors/types/integrations/auth/vendor.ssr.types";
import type { GetSessionParams } from "next-auth/react";

class NextAuthSSRClient implements AuthVendorSSRClientInterface {
  getSession = async (req: unknown) => {
    if (webFrameworkVendor.isBuildTime()) return null;
    return await getSession(req as GetSessionParams);
  };
}

export default NextAuthSSRClient;
