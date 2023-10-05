import APIEndpointBase from "@src/backend/api/services/generics/endpoints/generic.endpoint.base.class";
import ReportCacheProxy from "@src/backend/api/services/report.cache/proxy/proxy.class";
import * as status from "@src/config/status";
import { keysToLower } from "@src/utilities/generics/objects";
import { apiValidationVendorBackend } from "@src/vendors/integrations/api.validation/vendor.backend";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import { cacheVendorBackend } from "@src/vendors/integrations/cache/vendor.backend";
import type { ReportCacheProxyInterface } from "@src/backend/api/types/services/report.cache/proxy.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type { ReportCacheResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default abstract class ReportCacheEndpointAbstractFactoryV2 extends APIEndpointBase<
  ReportCacheProxyInterface,
  Promise<ReportCacheResponseInterface>
> {
  protected readonly delay: number = 500;
  protected proxy: ReportCacheProxyInterface;
  protected readonly validators =
    keysToLower<ApiValidationVendorBackendInterface>(
      apiValidationVendorBackend
    );
  public readonly service = "S3";

  constructor() {
    super();
    this.proxy = new ReportCacheProxy();
  }

  protected setUpHandler(): void {
    this.handler.post(this.route, async (req, res, next) => {
      const authClient = new authVendorBackend.Client(req);
      const token = await authClient.getSession();
      const [params, paramErrors] = this.getParams(req);
      if (!token || !token.email) {
        this.unauthorizedRequest(res);
      } else if (paramErrors) {
        this.invalidRequest(res);
      } else if (
        !req.body ||
        !this.validators[params.source.toString()][params.report.toString()](
          req.body
        ).valid
      ) {
        this.invalidRequest(res);
      } else {
        this.updateParamsWithAuthenticatedUser(params, token.email);
        const proxyResponse = await this.callProxy(req, res, next, params);
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(req, res, proxyResponse);
        } else {
          this.invalidProxyResponse(req, res);
        }
      }
      next();
    });
  }

  protected getParams(
    req: ApiFrameworkVendorApiRequestType
  ): [ApiEndpointRequestQueryParamType, boolean] {
    const params = req.query as ApiEndpointRequestQueryParamType;
    Object.keys(params).forEach((k) => {
      if (k !== "username" && params[k]) {
        params[k] = params[k].toString().toLowerCase();
      }
    });
    const error =
      !params.source ||
      !params.report ||
      !params.username ||
      !Object.keys(this.validators).includes(params.source.toString()) ||
      !Object.keys(this.validators[params.source.toString()]).includes(
        params.report.toString()
      );
    return [params, error];
  }

  protected updateParamsWithAuthenticatedUser(
    params: ApiEndpointRequestQueryParamType,
    tokenEmail: string
  ) {
    params["authenticatedUser"] = tokenEmail;
  }

  protected unauthorizedRequest(res: ApiFrameworkVendorApiResponseType): void {
    res.status(401).json(status.STATUS_401_MESSAGE);
  }

  protected invalidRequest(res: ApiFrameworkVendorApiResponseType): void {
    res.status(400).json(status.STATUS_400_MESSAGE);
  }

  protected async callProxy(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => void,
    params: ApiEndpointRequestQueryParamType
  ): Promise<Awaited<ReportCacheResponseInterface>> {
    this.setRequestTimeout(req, res, next);
    const proxyResponse = await this.getProxyResponse(params, req.body);
    this.clearRequestTimeout(req);
    return proxyResponse;
  }

  protected async getProxyResponse(
    params: ApiEndpointRequestQueryParamType,
    body: ApiEndpointRequestBodyType
  ) {
    const cacheReportObject =
      new cacheVendorBackend.CdnOriginReportsCacheObject({
        sourceName: String(params.source),
        authenticatedUserName: String(params.authenticatedUser),
        reportName: String(params.report),
        userName: String(params.username),
      });
    return await this.proxy.createCacheObject({
      cacheId: cacheReportObject.getCacheId(),
      objectContent: body,
      objectName: cacheReportObject.getStorageName(),
    });
  }

  protected isProxyResponseValid(
    proxyResponse: ReportCacheResponseInterface
  ): boolean {
    if (proxyResponse && proxyResponse.id) return true;
    return false;
  }

  protected invalidProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ): void {
    req.proxyResponse = `${this.service}: Invalid response!`;
    res.status(502).json(status.STATUS_502_MESSAGE);
  }

  protected validProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    proxyResponse: ReportCacheResponseInterface
  ): void {
    req.proxyResponse = `${this.service}: Success!`;
    res.status(201).json(proxyResponse);
  }
}
