import * as status from "@src/config/status";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class AuthenticationMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finished: () => Promise<void>
  ): Promise<void> {
    const authClient = new authVendorBackend.Client(req);
    const token = await authClient.getSession();
    if (!token || !token.email) {
      res.status(401).json(status.STATUS_401_MESSAGE);
      await finished();
    } else {
      req.authenticatedUserName = token.email;
      await next();
    }
  }
}
