import { knownStatuses } from "@src/config/api";
import requestSettings from "@src/config/requests";
import * as status from "@src/config/status";
import { apiHandlerVendorBackend } from "@src/vendors/integrations/api.handler/vendor.backend";
import { apiLoggerVendorBackend } from "@src/vendors/integrations/api.logger/vendor.backend";
import type { ApiEndPointFactoryInterface } from "@src/backend/api/types/services/endpoint.types";
import type { RemoteServiceError } from "@src/contracts/api/types/error.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type { ApiHandlerVendorHandlerType } from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { ApiLoggerVendorEndpointLoggerInterface } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export default abstract class APIEndpointBase<ProxyClass, ProxyClassReturnType>
  implements ApiEndPointFactoryInterface
{
  private readonly _endpointLogger: ApiLoggerVendorEndpointLoggerInterface;
  protected readonly timeOut = requestSettings.timeout;
  protected readonly handler: ApiHandlerVendorHandlerType;
  protected abstract proxy: ProxyClass;
  public abstract readonly service: string;
  public abstract readonly route: string;

  constructor() {
    this.handler = new apiHandlerVendorBackend.HandlerFactory({
      errorHandler: this.errorHandler,
      fallBackHandler: this.fallBackHandler,
    }).create();
    this._endpointLogger = new apiLoggerVendorBackend.endpointLogger();
  }

  protected abstract getProxyResponse(
    params: ApiEndpointRequestQueryParamType,
    body: ApiEndpointRequestBodyType | null
  ): ProxyClassReturnType;

  protected abstract setUpHandler(): void;

  public createHandler(): ApiHandlerVendorHandlerType {
    this.setUpHandler();
    this.handler.use(this._endpointLogger.log);
    return this.handler;
  }

  protected setRequestTimeout = (
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => void
  ): void => {
    req.proxyTimeoutInstance = setTimeout(() => {
      req.proxyResponse = `${this.service}: Timed out! Please retry this request!`;
      res.setHeader("retry-after", 0);
      res.status(503).json(status.STATUS_503_MESSAGE);
      delete req.proxyTimeoutInstance;
      next();
    }, this.timeOut);
  };

  protected clearRequestTimeout = (
    req: ApiFrameworkVendorApiRequestType
  ): void => {
    if (req.proxyTimeoutInstance) {
      clearTimeout(req.proxyTimeoutInstance);
      delete req.proxyTimeoutInstance;
    }
  };

  protected errorHandler = (
    err: RemoteServiceError,
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => void
  ): void => {
    this.clearRequestTimeout(req);
    req.proxyResponse = `${this.service}: ${err.toString()}`;
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
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ): void => {
    res.status(405).json(status.STATUS_405_MESSAGE);
  };
}
