import RequestParamsValidatorMiddleware from "./middleware/request.params.validator.middleware.class";
import AuthenticationMiddleware from "@src/api/services//generics/endpoints/middleware/authentication.middleware.class";
import APIEndpointBase from "@src/api/services/generics/endpoints/generic.endpoint.base.class";
import DelayMiddleware from "@src/api/services/generics/endpoints/middleware/delay.middleware.class";
import FlagStatusMiddleware from "@src/api/services/generics/endpoints/middleware/flag.status.middleware.class";
import LastFMProxy from "@src/api/services/lastfm/proxy/proxy.class";
import { proxyFailureStatusCodes } from "@src/config/api";
import * as status from "@src/config/status";
import type { LastFMProxyInterface } from "@src/api/types/services/lastfm/proxy/proxy.types";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type { ApiEndpointRequestQueryParamType } from "@src/contracts/api/types/request.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default abstract class LastFMApiEndpointFactoryBaseV2 extends APIEndpointBase<
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

  protected setUpHandler(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): ApiHandlerVendorRequestHandlerType {
    return middlewareStack.createHandler("GET", async (req, res, next) => {
      await this.waitToAvoidRateLimiting();
      const proxyResponse = await this.queryProxy(req);
      if (!this.isRequestTimedOut(req)) {
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(req, res, proxyResponse);
        } else {
          this.invalidProxyResponse(req, res);
        }
        await next();
      }
    });
  }

  protected override setUpMiddleware(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): void {
    middlewareStack.useBefore(new DelayMiddleware(this.delay));
    middlewareStack.useBefore(new AuthenticationMiddleware());
    middlewareStack.useBefore(
      new RequestParamsValidatorMiddleware(this.getParams)
    );
    middlewareStack.useBefore(new FlagStatusMiddleware(this.flag));
    super.setUpMiddleware(middlewareStack);
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

  protected async queryProxy(
    req: ApiFrameworkVendorApiRequestType
  ): Promise<
    ReturnType<Awaited<LastFMProxyInterface[keyof LastFMProxyInterface]>>
  > {
    const proxyResponse = await this.getProxyResponse(
      req.validatedParams as ApiEndpointRequestQueryParamType,
      null
    );
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
