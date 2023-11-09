import * as status from "@src/config/status";
import { apiLoggerVendorBackend } from "@src/vendors/integrations/api.logger/vendor.backend";
import type { ApiEndPointFactoryInterface } from "@src/api/types/services/endpoint.types";
import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorRequestHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { ApiLoggerVendorEndpointLoggerInterface } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export default abstract class APIRouterBase
  implements ApiEndPointFactoryInterface
{
  private readonly endpointLogger: ApiLoggerVendorEndpointLoggerInterface;
  public abstract readonly service: string;
  public abstract readonly route: string;
  protected readonly methods: {
    [method in HttpApiClientHttpMethodType]: ApiHandlerVendorRequestHandlerType | null;
  } = {
    GET: null,
    POST: null,
    PUT: null,
  };

  constructor() {
    this.endpointLogger = new apiLoggerVendorBackend.endpointLogger();
  }

  public createHandler(): ApiHandlerVendorRequestHandlerType {
    return async (
      req: ApiFrameworkVendorApiRequestType,
      res: ApiFrameworkVendorApiResponseType
    ) => {
      const targetMethod: null | ApiHandlerVendorRequestHandlerType =
        this.methods[String(req.method) as HttpApiClientHttpMethodType];
      if (targetMethod) {
        await targetMethod(req, res);
      } else {
        await this.unsupportedMethod(req, res);
      }
    };
  }

  protected async unsupportedMethod(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ) {
    res.status(405).json(status.STATUS_405_MESSAGE);
    this.endpointLogger.log(req, res);
  }
}
