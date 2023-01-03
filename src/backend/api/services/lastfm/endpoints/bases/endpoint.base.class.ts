import LastFMProxy from "@src/backend/api/services/lastfm/proxy/proxy.class";
import apiHandlerVendor from "@src/backend/integrations/api.handler/vendor";
import apiLoggerVendor from "@src/backend/integrations/api.logger/vendor";
import { knownStatuses } from "@src/config/api";
import requestSettings from "@src/config/requests";
import * as status from "@src/config/status";
import type { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { ApiEndPointFactoryInterface } from "@src/types/api/endpoint.types";
import type {
  ApiEndpointRequestType,
  ApiRequestQueryParamType,
  ApiRequestBodyType,
} from "@src/types/api/request.types";
import type { ApiEndpointResponseType } from "@src/types/api/response.types";
import type { ApiHandlerVendorHandlerType } from "@src/types/integrations/api.handler/vendor.types";
import type { ApiLoggerVendorEndpointLoggerInterface } from "@src/types/integrations/api.logger/vendor.types";
import type { LastFMProxyInterface } from "@src/types/integrations/lastfm/proxy.types";

export default abstract class LastFMEndpointBase
  implements ApiEndPointFactoryInterface
{
  private readonly _endpointLogger: ApiLoggerVendorEndpointLoggerInterface;
  protected readonly timeOut = requestSettings.timeout;
  protected readonly handler: ApiHandlerVendorHandlerType;
  protected readonly proxy: LastFMProxyInterface;
  public abstract readonly route: string;

  constructor() {
    this.handler = new apiHandlerVendor.HandlerFactory({
      errorHandler: this.errorHandler,
      fallBackHandler: this.fallBackHandler,
    }).create();
    this.proxy = new LastFMProxy();
    this._endpointLogger = new apiLoggerVendor.endpointLogger();
  }

  protected abstract getProxyResponse(
    params: ApiRequestQueryParamType | ApiRequestBodyType
  ): ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>;

  protected abstract setUpHandler(): void;

  public createHandler(): ApiHandlerVendorHandlerType {
    this.setUpHandler();
    this.handler.use(this._endpointLogger.log);
    return this.handler;
  }

  protected setRequestTimeout = (
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType,
    next: () => void
  ): void => {
    req.proxyTimeoutInstance = setTimeout(() => {
      req.proxyResponse = "Timed out! Please retry this request!";
      res.setHeader("retry-after", 0);
      res.status(503).json(status.STATUS_503_MESSAGE);
      delete req.proxyTimeoutInstance;
      next();
    }, this.timeOut);
  };

  protected clearRequestTimeout = (req: ApiEndpointRequestType): void => {
    if (req.proxyTimeoutInstance) {
      clearTimeout(req.proxyTimeoutInstance);
      delete req.proxyTimeoutInstance;
    }
  };

  protected errorHandler = (
    err: ProxyError,
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType,
    next: () => void
  ): void => {
    this.clearRequestTimeout(req);
    req.proxyResponse = err.toString();
    if (err.clientStatusCode && knownStatuses[err.clientStatusCode]) {
      res
        .status(err.clientStatusCode)
        .json(knownStatuses[err.clientStatusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
    next();
  };

  protected fallBackHandler = (
    req: ApiEndpointRequestType,
    res: ApiEndpointResponseType
  ): void => {
    res.status(405).json(status.STATUS_405_MESSAGE);
  };
}
