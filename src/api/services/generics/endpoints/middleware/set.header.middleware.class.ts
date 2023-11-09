import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class SetHeaderMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly headerContent: string;
  protected readonly headerName: string;

  constructor(headerName: string, headerContent: string) {
    this.headerName = headerName;
    this.headerContent = headerContent;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>
  ): Promise<void> {
    res.setHeader(this.headerName, this.headerContent);
    await next();
  }
}
