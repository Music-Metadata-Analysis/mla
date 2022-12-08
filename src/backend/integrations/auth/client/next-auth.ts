import { getToken } from "next-auth/jwt";
import { normalizeNull } from "@src/utils/voids";
import type { VendorApiRequest } from "@src/types/clients/web.framework/vendor.types";
import type { AuthVendorClientInterface } from "@src/types/integrations/auth/vendor.types";

export default class NextAuthClient implements AuthVendorClientInterface {
  protected request: VendorApiRequest;

  constructor(request: unknown) {
    this.request = request as VendorApiRequest;
  }

  getSession = async () => {
    const token = await getToken({
      req: this.request,
      secret: process.env.AUTH_MASTER_JWT_SECRET,
    });
    if (!token) return null;
    return {
      email: normalizeNull(token.email),
      image: normalizeNull(token.picture),
      name: normalizeNull(token.name),
      group: normalizeNull(token.group as string),
    };
  };
}
