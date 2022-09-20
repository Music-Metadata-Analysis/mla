import { getToken } from "next-auth/jwt";
import type { AuthVendorClientInterface } from "../../../../types/integrations/auth/vendor.types";
import type { NextApiRequest } from "next";

export default class NextAuthClient implements AuthVendorClientInterface {
  protected request: NextApiRequest;

  constructor(request: unknown) {
    this.request = request as NextApiRequest;
  }

  getSession = async () => {
    const token = await getToken({
      req: this.request,
      secret: process.env.AUTH_MASTER_JWT_SECRET,
    });
    if (!token) return null;
    return {
      email: token.email ? token.email : null,
      image: token.picture ? token.picture : null,
      name: token.name ? token.name : null,
    };
  };
}
