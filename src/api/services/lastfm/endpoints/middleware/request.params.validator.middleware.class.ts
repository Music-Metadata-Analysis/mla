import * as status from "@src/config/status";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class RequestParamsValidatorMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected getParams: (
    req: ApiFrameworkVendorApiRequestType
  ) => [ApiEndpointRequestQueryParamType, boolean];

  constructor(
    getParams: (
      req: ApiFrameworkVendorApiRequestType
    ) => [ApiEndpointRequestQueryParamType, boolean]
  ) {
    this.getParams = getParams;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finished: () => Promise<void>
  ): Promise<void> {
    const [params, paramErrors] = this.getParams(req);
    if (paramErrors) {
      res.status(400).json(status.STATUS_400_MESSAGE);
      await finished();
    } else {
      req.validatedParams = params;
      await next();
    }
  }
}
