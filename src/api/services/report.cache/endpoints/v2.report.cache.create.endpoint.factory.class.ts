import APIEndpointBase from "@src/api/services/generics/endpoints/generic.endpoint.base.class";
import ReportCacheProxy from "@src/api/services/report.cache/proxy/proxy.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import apiRoutes from "@src/config/apiRoutes";
import * as status from "@src/config/status";
import { keysToLower } from "@src/utilities/generics/objects";
import { apiValidationVendorBackend } from "@src/vendors/integrations/api.validation/vendor.backend";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import type { ReportCacheProxyInterface } from "@src/api/types/services/report.cache/proxy/proxy.types";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type { ReportCacheCreateResponseInterface } from "@src/contracts/api/types/services/report.cache/response.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiValidationVendorBackendInterface } from "@src/vendors/types/integrations/api.validator/vendor.backend.types";

export default class ReportCacheCreateEndpointFactoryV2 extends APIEndpointBase<
  ReportCacheProxyInterface,
  Promise<ReportCacheCreateResponseInterface>
> {
  protected readonly delay: number = 500;
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  protected proxy: ReportCacheProxyInterface;
  protected readonly validators =
    keysToLower<ApiValidationVendorBackendInterface>(
      apiValidationVendorBackend
    );
  public readonly service = "S3";
  public readonly route = apiRoutes.v2.cache.create;

  constructor() {
    super();
    this.proxy = new ReportCacheProxy();
    this.proxyFailureStatusCodes = {
      ...proxyFailureStatusCodes.reportCacheCreate,
    };
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
          this.validProxyResponse(
            req,
            res,
            proxyResponse as ReportCacheCreateResponseInterface
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
    params["authenticated"] = tokenEmail;
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
  ): Promise<Awaited<ReportCacheCreateResponseInterface>> {
    this.setRequestTimeout(req, res, next);
    const proxyResponse = await this.getProxyResponse(params, req.body);
    this.clearRequestTimeout(req);
    return proxyResponse;
  }

  protected async getProxyResponse(
    params: ApiEndpointRequestQueryParamType,
    body: ApiEndpointRequestBodyType
  ) {
    return await this.proxy.createCacheObject({
      authenticatedUserName: String(params.authenticated),
      reportName: String(params.report),
      sourceName: String(params.source),
      userName: String(params.username),
      content: body,
    });
  }

  protected isProxyResponseValid(
    proxyResponse: ReportCacheCreateResponseInterface
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
    proxyResponse: ReportCacheCreateResponseInterface
  ): void {
    req.proxyResponse = `${this.service}: Success!`;
    res.status(201).json(proxyResponse);
  }
}
