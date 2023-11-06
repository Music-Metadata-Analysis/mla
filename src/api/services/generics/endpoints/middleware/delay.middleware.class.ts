import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class DelayMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly delay: number;

  constructor(delay: number) {
    this.delay = delay;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>
  ): Promise<void> {
    await this.wait();
    await next();
  }

  protected wait(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }
}
