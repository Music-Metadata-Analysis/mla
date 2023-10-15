import APIEndpointBase from "@src/api/services/generics/endpoints/generic.endpoint.base.class";
import LastFMProxy from "@src/api/services/lastfm/proxy/proxy.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import * as status from "@src/config/status";
import { authVendorBackend } from "@src/vendors/integrations/auth/vendor.backend";
import { flagVendorBackend } from "@src/vendors/integrations/flags/vendor.backend";
import type { LastFMProxyInterface } from "@src/api/types/services/lastfm/proxy/proxy.types";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

export default abstract class LastFMApiEndpointFactoryV2 extends APIEndpointBase<
  LastFMProxyInterface,
  ReturnType<Awaited<LastFMProxyInterface[keyof LastFMProxyInterface]>>
> {
  protected proxy: LastFMProxy;
  protected readonly delay: number = 500;
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  public abstract readonly flag: string | null;
  public readonly cacheMaxAgeValue = 3600 * 24;
  public readonly service = "LAST.FM";

  constructor() {
    super();
    this.proxy = new LastFMProxy();
    this.proxyFailureStatusCodes = { ...proxyFailureStatusCodes.lastfm };
  }

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      await this.waitToAvoidRateLimiting();
      const authClient = new authVendorBackend.Client(req);
      const token = await authClient.getSession();
      const [params, paramErrors] = this.getParams(req);
      if (!token) {
        this.unauthorizedRequest(res);
      } else if (paramErrors) {
        this.invalidRequest(res);
      } else if (!(await this.isEnabled())) {
        res.status(404).json(status.STATUS_404_MESSAGE);
      } else {
        const proxyResponse = await this.queryProxy(req, res, next, params);
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(req, res, proxyResponse);
        } else {
          this.invalidProxyResponse(req, res);
        }
      }
      next();
    });
  }

  protected waitToAvoidRateLimiting(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  protected getParams(
    req: ApiFrameworkVendorApiRequestType
  ): [ApiEndpointRequestQueryParamType, boolean] {
    const params = req.query as ApiEndpointRequestQueryParamType;
    const error = !params.username;
    return [params, error];
  }

  protected async isEnabled(): Promise<boolean> {
    if (!this.flag) return true;

    const client = new flagVendorBackend.Client(
      process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT
    );

    return await client.isEnabled(this.flag);
  }

  protected unauthorizedRequest(res: ApiFrameworkVendorApiResponseType): void {
    res.status(401).json(status.STATUS_401_MESSAGE);
  }

  protected invalidRequest(res: ApiFrameworkVendorApiResponseType): void {
    res.status(400).json(status.STATUS_400_MESSAGE);
  }

  protected async queryProxy(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => void,
    params: ApiEndpointRequestQueryParamType
  ): Promise<
    ReturnType<Awaited<LastFMProxyInterface[keyof LastFMProxyInterface]>>
  > {
    this.setRequestTimeout(req, res, next);
    const proxyResponse = await this.getProxyResponse(params, null);
    this.clearRequestTimeout(req);
    return proxyResponse;
  }

  protected isProxyResponseValid(
    proxyResponse: Awaited<
      ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>
    >
  ): boolean {
    if (proxyResponse) return true;
    return false;
  }

  protected invalidProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ): void {
    req.proxyResponse = `${this.service}: Invalid response, please retry.`;
    res.setHeader("retry-after", 0);
    res.status(503).json(status.STATUS_503_MESSAGE);
  }

  protected validProxyResponse(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    proxyResponse: Awaited<
      ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>
    >
  ): void {
    req.proxyResponse = `${this.service}: Success!`;
    res.setHeader("Cache-Control", [
      "public",
      `max-age=${this.cacheMaxAgeValue}`,
    ]);
    res.status(200).json(proxyResponse);
  }
}
