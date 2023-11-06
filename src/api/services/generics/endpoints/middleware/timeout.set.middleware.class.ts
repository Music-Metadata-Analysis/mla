import * as status from "@src/config/status";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class TimeoutSetMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly service: string;
  protected readonly timeOut: number;

  constructor(service: string, timeOut: number) {
    this.service = service;
    this.timeOut = timeOut;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finish: () => Promise<void>
  ): Promise<void> {
    req.proxyTimeoutInstance = setTimeout(async () => {
      req.proxyResponse = `${this.service}: Timed out! Please retry this request!`;
      res.setHeader("retry-after", 0);
      res.status(503).json(status.STATUS_503_MESSAGE);
      delete req.proxyTimeoutInstance;
      await finish();
    }, this.timeOut);
    await next();
  }
}
