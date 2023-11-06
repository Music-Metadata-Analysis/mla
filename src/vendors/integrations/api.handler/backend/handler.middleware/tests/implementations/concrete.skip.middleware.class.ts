import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class ConcreteSkipMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finished: () => Promise<void>
  ): Promise<void> {
    (
      res as ApiFrameworkVendorApiResponseType & { mockCalls: string[] }
    ).mockCalls.push(ConcreteSkipMiddleware.name);
    await finished();
  }
}
