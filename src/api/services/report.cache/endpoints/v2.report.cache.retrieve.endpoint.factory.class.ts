import APIEndpointBase from "@src/api/services/generics/endpoints/generic.endpoint.base.class";
import ReportCacheProxy from "@src/api/services/report.cache/proxy/proxy.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import type { ReportCacheProxyInterface } from "@src/api/types/services/report.cache/proxy/proxy.types";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type { ReportCacheRetrieveResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { PersistenceVendorDataType } from "@src/vendors/types/integrations/persistence/vendor.backend.types";

export default class ReportCacheRetrieveEndpointFactoryV2 extends APIEndpointBase<
  ReportCacheProxyInterface,
  Promise<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>>
> {
  protected readonly delay: number = 500;
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  protected proxy: ReportCacheProxyInterface;
  public readonly service = "CloudFront";
  public readonly route = apiRoutes.v2.cache.retrieve;

  constructor() {
    super();
    this.proxy = new ReportCacheProxy();
    this.proxyFailureStatusCodes = {
      ...proxyFailureStatusCodes.reportCacheRetrieve,
    };
  }

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      const authClient = new authVendorBackend.Client(req);
      const token = await authClient.getSession();
      const [params, paramErrors] = this.getParams(req);
      if (!token || !token.email) {
        this.unauthorizedRequest(res);
      } else if (paramErrors) {
        this.invalidRequest(res);
      } else {
        this.updateParamsWithAuthenticatedUser(params, token.email);
        const proxyResponse = await this.callProxy(req, res, next, params);
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(
            req,
            res,
            proxyResponse as ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>
          );
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
    const error = !params.source || !params.report || !params.username;
    return [params, error];
  }

  protected unauthorizedRequest(res: ApiFrameworkVendorApiResponseType): void {
    res.status(401).json(status.STATUS_401_MESSAGE);
  }

  protected invalidRequest(res: ApiFrameworkVendorApiResponseType): void {
    res.status(400).json(status.STATUS_400_MESSAGE);
  }

  protected updateParamsWithAuthenticatedUser(
    params: ApiEndpointRequestQueryParamType,
    tokenEmail: string
  ) {
    params["authenticated"] = tokenEmail;
  }

  protected async callProxy(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => void,
    params: ApiEndpointRequestQueryParamType
  ): Promise<
    Awaited<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType> | void>
  > {
    this.setRequestTimeout(req, res, next);
    const proxyResponse = await this.getProxyResponse(params);
    this.clearRequestTimeout(req);
    return proxyResponse;
  }

  protected async getProxyResponse(
    params: ApiEndpointRequestQueryParamType
  ): Promise<
    Awaited<ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>>
  > {
    return (await this.proxy.retrieveCacheObject({
      authenticatedUserName: String(params.authenticated),
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
    proxyResponse: ReportCacheRetrieveResponseInterface<PersistenceVendorDataType>
  ): void {
    req.proxyResponse = `${this.service}: Success!`;
    res.setHeader("Cache-Control", proxyResponse.cacheControl);
    res.status(200).json(proxyResponse.response);
  }
}
