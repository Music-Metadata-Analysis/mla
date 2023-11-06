import * as status from "@src/config/status";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class ConcreteResponseMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>
  ): Promise<void> {
    (
      res as ApiFrameworkVendorApiResponseType & { mockCalls: string[] }
    ).mockCalls.push(ConcreteResponseMiddleware.name);
    res.status(400).json(status.STATUS_400_MESSAGE);
    await next();
  }
}
