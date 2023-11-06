import APIEndpointBase from "@src/api/services/generics/endpoints/generic.endpoint.base.class";
import ReportCacheProxy from "@src/api/services/report.cache/proxy/proxy.class";
import * as status from "@src/config/status";
import type { ReportCacheProxyInterface } from "@src/api/types/services/report.cache/proxy/proxy.types";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

export default abstract class ReportCacheEndpointFactoryBaseV2<
  Response,
> extends APIEndpointBase<ReportCacheProxyInterface, Promise<Response>> {
  protected readonly delay: number = 500;
  protected abstract readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  protected proxy: ReportCacheProxyInterface;

  constructor() {
    super();
    this.proxy = new ReportCacheProxy();
  }

  protected async callProxy(
    req: ApiFrameworkVendorApiRequestType
  ): Promise<Awaited<Response>> {
    const proxyResponse = await this.getProxyResponse(
      {
        authenticatedUserName: String(req.authenticatedUserName),
        ...(req.validatedParams as ApiEndpointRequestQueryParamType),
      },
      req.body
    );
    return proxyResponse;
  }

  protected invalidProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ): void {
    req.proxyResponse = `${this.service}: Invalid response!`;
    res.status(502).json(status.STATUS_502_MESSAGE);
  }
}
