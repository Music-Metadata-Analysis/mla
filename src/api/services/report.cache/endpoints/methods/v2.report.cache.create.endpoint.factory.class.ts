import ReportCacheEndpointFactoryBaseV2 from "./generics/v2.report.cache.endpoint.factory.base.class";
import CreateRequestBodyValidatorMiddleware from "../middleware/create.request.body.validator.middleware.class";
import CreateRequestParamsValidatorMiddleware from "../middleware/create.request.params.validator.middleware.class";
import AuthenticationMiddleware from "@src/api/services/generics/endpoints/middleware/authentication.middleware.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import { keysToLower } from "@src/utilities/generics/objects";
import { apiValidationVendorBackend } from "@src/vendors/integrations/api.validation/vendor.backend";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type { DataSourceType } from "@src/contracts/api/types/source.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class ReportCacheCreateEndpointFactoryV2 extends ReportCacheEndpointFactoryBaseV2<ReportCacheCreateResponseInterface> {
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  protected readonly validators =
    keysToLower<ApiValidationVendorBackendInterface>(
      apiValidationVendorBackend
    );
  public readonly service = "S3";
  public readonly route = apiRoutes.v2.cache;

  constructor() {
    super();
    this.proxyFailureStatusCodes = {
      ...proxyFailureStatusCodes.reportCacheCreate,
    };
  }

  protected setUpHandler(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): ApiHandlerVendorRequestHandlerType {
    return middlewareStack.createHandler("POST", async (req, res, next) => {
      const proxyResponse = await this.callProxy(req);
      if (!this.isRequestTimedOut(req)) {
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(
            req,
            res,
            proxyResponse as ReportCacheCreateResponseInterface
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
    middlewareStack.useBefore(
      new CreateRequestParamsValidatorMiddleware(this.validators)
    );
    middlewareStack.useBefore(
      new CreateRequestBodyValidatorMiddleware(this.validators)
    );
    super.setUpMiddleware(middlewareStack);
  }

  protected async getProxyResponse(
    params: ApiEndpointRequestQueryParamType,
    body: ApiEndpointRequestBodyType
  ) {
    return await this.proxy.createCacheObject({
      authenticatedUserName: String(params.authenticatedUserName),
      reportName: String(params.report),
      sourceName: String(params.source) as Lowercase<DataSourceType>,
      userName: String(body.userName),
      content: body,
    });
  }

  protected isProxyResponseValid(
    proxyResponse: ReportCacheCreateResponseInterface
  ): boolean {
    if (proxyResponse && proxyResponse.id) return true;
    return false;
  }

  protected validProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    proxyResponse: ReportCacheCreateResponseInterface
  ): void {
    req.proxyResponse = `${this.service}: Success!`;
    res.status(201).json(proxyResponse);
  }
}
