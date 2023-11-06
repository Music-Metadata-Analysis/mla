import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { ApiLoggerVendorEndpointLoggerInterface } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export default class EndPointLoggerMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly endpointLogger: ApiLoggerVendorEndpointLoggerInterface;

  constructor(endpointLogger: ApiLoggerVendorEndpointLoggerInterface) {
    this.endpointLogger = endpointLogger;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>
  ): Promise<void> {
    this.endpointLogger.log(req, res);
    await next();
  }
}
