import ReportCacheEndpointFactoryBaseV2 from "./generics/v2.report.cache.endpoint.factory.base.class";
import RetrieveRequestParamsValidatorMiddleware from "./middleware/retrieve.request.params.validator.middleware.class";
import AuthenticationMiddleware from "@src/api/services/generics/endpoints/middleware/authentication.middleware.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type { ReportCacheRetrieveResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default class ReportCacheRetrieveEndpointFactoryV2 extends ReportCacheEndpointFactoryBaseV2<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType> | void> {
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  public readonly service = "CloudFront";
  public readonly route = apiRoutes.v2.cache.retrieve;

  constructor() {
    super();
    this.proxyFailureStatusCodes = {
      ...proxyFailureStatusCodes.reportCacheRetrieve,
    };
  }

  protected setUpHandler(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): ApiHandlerVendorRequestHandlerType {
    return middlewareStack.createHandler("GET", async (req, res, next) => {
      const proxyResponse = await this.callProxy(req);
      if (!this.isRequestTimedOut(req)) {
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(
            req,
            res,
            proxyResponse as ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>
          );
        } else {
          this.invalidProxyResponse(req, res);
        }
        next();
      }
    });
  }

  protected override setUpMiddleware(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): void {
    middlewareStack.useBefore(new AuthenticationMiddleware());
    middlewareStack.useBefore(new RetrieveRequestParamsValidatorMiddleware());
    super.setUpMiddleware(middlewareStack);
  }

  protected async getProxyResponse(
    params: ApiEndpointRequestQueryParamType
  ): Promise<
    Awaited<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>>
  > {
    return (await this.proxy.retrieveCacheObject({
      authenticatedUserName: String(params.authenticatedUserName),
      reportName: String(params.report),
      sourceName: String(params.source),
      userName: String(params.username),
    })) as ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>;
  }

  protected isProxyResponseValid(
    proxyResponse: ReportCacheRetrieveResponseInterface<PersistenceVendorDataType> | void
  ): boolean {
    if (proxyResponse && proxyResponse.response && proxyResponse.cacheControl) {
      return true;
    }
    return false;
  }

  protected validProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    proxyResponse: ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>
  ): void {
    req.proxyResponse = `${this.service}: Success!`;
    res.setHeader("Cache-Control", proxyResponse.cacheControl);
    res.status(200).json(proxyResponse.response);
  }
}
