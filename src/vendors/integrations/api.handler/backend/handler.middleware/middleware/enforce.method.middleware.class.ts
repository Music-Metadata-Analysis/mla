import * as status from "@src/config/status";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class EnforceMethodMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly method: HttpApiClientHttpMethodType;

  constructor(method: HttpApiClientHttpMethodType) {
    this.method = method;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finish: () => Promise<void>
  ): Promise<void> {
    if (req.method === this.method) {
      await next();
    } else {
      res.status(405).json(status.STATUS_405_MESSAGE);
      await finish();
    }
  }
}
