import * as status from "@src/config/status";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorMiddlewareInterface } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class FlagStatusMiddleware
  implements ApiHandlerVendorMiddlewareInterface
{
  protected readonly flag: string | null;

  constructor(flag: string | null) {
    this.flag = flag;
  }

  public async handler(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => Promise<void>,
    finished: () => Promise<void>
  ): Promise<void> {
    if (!(await this.isEnabled())) {
      res.status(404).json(status.STATUS_404_MESSAGE);
      await finished();
    } else {
      await next();
    }
  }

  protected async isEnabled(): Promise<boolean> {
    if (!this.flag) return true;

    const client = new flagVendorBackend.Client(
      process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT
    );

    return await client.isEnabled(this.flag);
  }
}
